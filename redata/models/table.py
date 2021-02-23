import datetime
import itertools
import re
from collections import defaultdict

from sqlalchemy.sql.sqltypes import Date
from redata import settings
from redata.models.base import Base
from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, JSON
from sqlalchemy.dialects.postgresql import JSONB
from sqlalchemy.orm import relationship
from redata.db_operations import metrics_session
import json


class MonitoredTable(Base):
    __tablename__ = 'monitored_table'

    id = Column(Integer, primary_key=True)
    created_at = Column(TIMESTAMP, default=datetime.datetime.utcnow)
    source_db = Column(String, default=None)
    active = Column(Boolean, default=True)

    table_name = Column(String)
    time_column = Column(String)
    time_column_type = Column(String)
    schema = Column(JSONB)
    namespace = Column(String)

    checks = relationship("Check", backref="table")
    alerts = relationship("Alert", backref="table")

    def __str__(self):
        return f"{self.namespace}.{self.table_name}"

    @property
    def full_table_name(self):
        if not self.namespace:
            return self.table_name
        else:
            return f'{self.namespace}.{self.table_name}'

    @classmethod
    def setup_for_source_table(cls, db, db_table_name, namespace):
        print (f"Running setup for {db_table_name}")

        valid_types = db.datetime_types()
        schema_cols = db.get_table_schema(db_table_name, namespace)

        table = MonitoredTable(
            table_name=db_table_name,
            schema={'columns': schema_cols},
            source_db=db.name,
            namespace=namespace
        )

        # heuristics to find best column to sort by when computing stats about data
        # TODO: could probably look up in a provided table of regex + score, with higher scored matches being preferred

        # list all date/timestamp columns, filtering out anything that's blacklisted in configuration
        blacklist_regex = settings.REDATA_TIME_COL_BLACKLIST_REGEX
        matching_cols = [
            col['name'] for col in schema_cols
            if col['type'] in valid_types and
            (not blacklist_regex or re.search(blacklist_regex, col['name']) is None)
        ]

        # from matches, collect time cols that have max values at or before "now"
        cols_by_ts = defaultdict(list)
        now_ts = datetime.datetime.now()
        for col in matching_cols:
            max_ts = db.get_max_timestamp(table, col)
            if not max_ts or max_ts <= now_ts:
                cols_by_ts[max_ts].append(col)

        # list of all viable candidates, ordered by latest timestamp first
        candidates = list(itertools.chain(
            *[cols for ts, cols in sorted(cols_by_ts.items(), reverse=True)]
        ))

        # list of preferred columns out of the viable ones, by name filtering
        preferred = [col for col in candidates if col.lower().find('creat') != -1]

        if len(candidates) == 0:
            # no columns found? ignore table..
            # TODO: add it, but set to disabled, for screening via web UI when we have one
            print (f"Not found column to sort by for {db_table_name}, skipping it for now")
            return None
        else:
            # if multiple columns found, primarily select from 'preferred' if exists, then set up the table
            col_name = preferred[0] if preferred else candidates[0]
            col_type = [col['type'] for col in schema_cols if col['name'] == col_name][0]

            if len(candidates) > 1:
                print (f"Found multiple columns to sort by {candidates}, choosing {col_name}, please update in DB if needed")
            else:
                print (f"Found column to sort by {col_name}")

            table.time_column=col_name
            table.time_column_type=col_type

            metrics_session.add(table)
            metrics_session.commit()
            return table

    @classmethod
    def get_monitored_tables(cls, db_name):
        return (
            metrics_session.query(cls)
            .filter(cls.active == True)
            .filter(cls.source_db == db_name)
            .all()
        )

    @classmethod
    def get_monitored_tables_per_namespace(cls, db_name, namespace):
        return (
            metrics_session.query(cls)
            .filter(cls.active == True)
            .filter(cls.source_db == db_name)
            .filter(cls.namespace == namespace)
            .all()
        )

    @classmethod
    def update_schema_for_table(cls, table, schema_cols):
        table = metrics_session.query(cls).filter(cls.table_name == table).first()

        table.schema = {'columns': schema_cols}
        metrics_session.commit()
