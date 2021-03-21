from datetime import datetime, timedelta

from sqlalchemy import create_engine, func
from sqlalchemy.schema import MetaData
from sqlalchemy.sql import text

from redata.backends.base import DB
from redata.backends.sql_alchemy import SqlAlchemy


class BigQuery(SqlAlchemy):
    @staticmethod
    def numeric_types():
        return ["INT64", "NUMERIC", "BIGNUMERIC", "FLOAT64"]

    @staticmethod
    def character_types():
        return ["STRING"]

    @staticmethod
    def datetime_types():
        return ["TIMESTAMP", "DATETIME"]

    def get_time_to_compare(self, time_interval, conf):
        to_compare = self.transform_by_interval(time_interval, conf)
        return self.get_timestamp(to_compare)

    def get_timestamp(self, from_time):
        return func.timestamp(from_time)

    def to_naive_timestamp(self, from_time):
        return from_time.replace(tzinfo=None)

    def get_max_timestamp(self, table, column):
        ts_tz = super().get_max_timestamp(table, column)
        if not ts_tz:
            return None
        return ts_tz.replace(tzinfo=None)

    def get_table_obj(self, table):
        if not getattr(self, "_tables", None):
            metadata = MetaData()
            metadata.reflect(bind=self.db)
            self._tables = metadata.tables

        return self._tables[table.full_table_name]

    def table_names(self, namespace):
        names = self.db.table_names(namespace)

        # Bigquery returns full names as tablesnames, trimming it here
        return [full_name.split(".")[1] for full_name in names]

    def get_table_schema(self, table_name, namespace):

        result = self.db.execute(
            f"""
            SELECT
                column_name as name,
                data_type as type
            FROM
                {namespace}.INFORMATION_SCHEMA.COLUMNS
            WHERE
                table_name = '{table_name}'
        """
        )
        return [{"name": c_name, "type": c_type} for c_name, c_type in result]
