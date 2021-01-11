import datetime
import itertools
import re
from collections import defaultdict

from sqlalchemy.sql.sqltypes import Date
from redata import settings
from redata.models.base import Base
from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, JSON
from redata.db_operations import get_current_table_schema
from sqlalchemy.dialects.postgresql import JSONB
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

    @classmethod
    def setup_for_source_table(cls, db, db_table_name):
        print (f"Running setup for {db_table_name}")

        try:
            preference = db.datetime_types()
        except AttributeError:
            preference = [
                'timestamp without time zone',
                'timestamp with time zone',
                'date',
                'datetime' #mysql
            ]

        schema_cols = get_current_table_schema(db, db_table_name)

        table = MonitoredTable(
            table_name=db_table_name,
            schema={'columns': schema_cols},
            source_db=db.name
        )

        # heuristics to find best column to sort by when computing stats about data
        # TODO: could probably look up in a provided table of regex + score, with higher scored matches being preferred

        blacklist_regex = settings.REDATA_TIME_COL_BLACKLIST_REGEX
        matching_cols = [col['name'] for col in schema_cols if col['type'] in preference and re.search(blacklist_regex, col['name']) is None]

        cols_by_ts = defaultdict(list)
        now_ts = datetime.datetime.now()
        # collect time cols that have max values at or before "now"
        for col in matching_cols:
            try:
                # use a datasource check if available
                max_ts = ensure_datetime(db.check_col(table, col, 'max').value)
            except AttributeError:
                # else, just assign now()
                max_ts = now_ts
            if max_ts <= now_ts:
                cols_by_ts[max_ts].append(col)

        candidates = list(itertools.chain(
            *[cols for ts, cols in sorted(cols_by_ts.items(), reverse=True)]
        ))
        preferred = [col for col in candidates if col.lower().find('creat') != -1]

        if len(candidates) == 0:
            print (f"Not found column to sort by for {db_table_name}, skipping it for now")
            return None
        else:
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
    def update_schema_for_table(cls, table, schema_cols):
        table = metrics_session.query(cls).filter(cls.table_name == table).first()

        table.schema = {'columns': schema_cols}
        metrics_session.commit()


def ensure_datetime(d):
    if isinstance(d, datetime.datetime):
        return d
    elif isinstance(d, datetime.date):
        return datetime.datetime(d.year, d.month, d.day)
    else:
        raise TypeError("argument must be date or datetime")
