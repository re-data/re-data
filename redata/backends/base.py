from datetime import date, datetime

from redata.utils import time_utils


class DB(object):
    def __init__(self, dbsource, db, schema):
        self.dbsource = dbsource
        self.name = dbsource.name
        self.db = db
        self.namespaces = [None] if not schema else schema

    def execute(self, *args, **kwargs):
        return self.db.execute(*args, **kwargs)

    def get_max_timestamp(self, table, column):
        result = self.db.execute(
            f"SELECT max({column}) as value FROM {table.full_table_name}"
        ).first()
        if not result.value:
            # No data yet in this column
            return None
        return self.ensure_datetime(result.value)

    def is_numeric(self, col_type):
        return col_type in self.numeric_types()

    def is_character(self, col_type):
        return col_type in self.character_types()

    def get_time_to_compare(self, time_interval, for_time):
        before = time_utils.transform_by_interval(time_interval, for_time)
        return self.get_timestamp(before)

    def get_timestamp(self, from_time):
        # this is overridden by bigquery, return right type in that case
        return from_time

    @staticmethod
    def ensure_datetime(d):
        if isinstance(d, datetime):
            return d
        elif isinstance(d, date):
            return datetime(d.year, d.month, d.day)
        else:
            raise TypeError("argument must be date or datetime")

    def check_custom_query(self, table, query, conf):

        query = query.replace("{{table_name}}", table.full_table_name)
        period_end = conf.for_time

        period_start = self.get_time_to_compare("1 day", conf.for_time)
        period_start = f"'{period_start}'"
        period_end = f"'{period_end}'"

        query = query.replace("{{period_start}}", period_start)
        query = query.replace("{{period_end}}", period_end)

        result = self.db.execute(query)
        result = result.fetchall()
        return [dict(row) for row in result]
