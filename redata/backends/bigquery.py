from redata.backends.sql_alchemy import SqlAlchemy
from redata.backends.base import DB
from datetime import timedelta
from sqlalchemy.sql import text
from sqlalchemy import create_engine, func
from datetime import datetime, timedelta


class BigQuery(SqlAlchemy):
    
    @staticmethod
    def numeric_types():
        return [
            'INT64',
            'NUMERIC',
            'BIGNUMERIC',
            'FLOAT64'
        ]

    @staticmethod
    def character_types():
        return [
            'STRING'
        ]
    
    @staticmethod
    def datetime_types():
        return [
            'TIMESTAMP',
            'DATETIME'
        ]

    def get_time_to_compare(self, time_interval):
        to_compare = self.transform_by_interval(time_interval)
        return self.get_timestamp(to_compare)

    def get_timestamp(self, from_time):
        return func.timestamp(from_time)

    def to_naive_timestamp(self, from_time):
        return from_time.replace(tzinfo=None)
    
    def get_max_timestamp(self, table, column):
        ts_tz =  super().get_max_timestamp(table, column)
        return ts_tz.replace(tzinfo=None)

    def get_table_schema(self, table_name, namespace):

        result = self.db.execute(f"""
            SELECT
                column_name as name,
                data_type as type
            FROM
                {namespace}.INFORMATION_SCHEMA.COLUMNS
            WHERE
                table_name = '{table_name}'
        """)
        return [ {'name': c_name, 'type': c_type} for c_name, c_type in result]
        