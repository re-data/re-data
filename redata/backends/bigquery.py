from redata.backends.base import DB
from datetime import timedelta
from sqlalchemy.sql import text

class BigQuery(DB):
    def __init__(self, name, db, dataset):
        super().__init__(name, db)
        self.dataset = dataset
    
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
    
    def get_interval_sep(self):
        return "'"
    
    def get_age_function(self):
        return "DATE_DIFF"

    def check_data_delayed(self, table):
        result = self.db.execute(f"""
            SELECT
                TIMESTAMP_DIFF(CURRENT_TIMESTAMP(), max(crated_at), SECOND) as total_seconds
            FROM {self.dataset}.{table.table_name}
        """)
        seconds = result.fetchall()[0][0]
        return [timedelta(seconds=seconds)]

    
    def check_data_volume_diff(self, table, from_time):
        result = self.db.execute(text(f"""
            SELECT count(*) as count
            FROM {table.table_name}
            WHERE {table.time_column} >= TIMESTAMP(:from_time)
        """), {'from_time': from_time}).first()
        return result


    def get_table_schema(self, table_name):
        result = self.db.execute(f"""
            SELECT
                column_name as name,
                data_type as type
            FROM
                {self.dataset}.INFORMATION_SCHEMA.COLUMNS
            WHERE
                table_name = '{table_name}'
        """)
        return result.fetchall()
        