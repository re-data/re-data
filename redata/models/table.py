import datetime
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

        preference = [
            'timestamp without time zone',
            'timestamp with time zone',
            'date',
            'datetime' #mysql
        ]
        schema_cols = get_current_table_schema(db, db_table_name)

        # heuristics to find best column to sort by when computing stats about data
        proper_type = [col['name'] for col in schema_cols if col['type'] in preference]
        columns = [c for c in proper_type if c.find('creat') != -1 ]

        colname, col_type = None, None

        if len(proper_type) == 0:
            print (f"Not found column to sort by for {db_table_name}, skipping it for now")
            return None
        else:
            if len(columns) > 1:
                print (f"Found multiple columns to sort by {columns}, choosing {columns[0]}, please update in DB if needed")

            col_name = columns[0] if columns else proper_type[0]
            col_type = [col['type'] for col in schema_cols if col['name'] == col_name][0]
            print (f"Found column to sort by {col_name}")

            table = MonitoredTable(
                table_name=db_table_name,
                time_column=col_name,
                time_column_type=col_type,
                schema={'columns': schema_cols},
                source_db=db.name
            )
            
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
