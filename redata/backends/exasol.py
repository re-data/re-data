import datetime
import decimal
from types import SimpleNamespace
from urllib.parse import urlparse

import pyexasol
from redata.backends.base import DB


class ExasolEngine(object):
    def __init__(self, url):
        self.creds = parse_url(url)

    def execute(self, *args, fetch_dict=False, **kwargs):
        with pyexasol.connect(**self.creds, fetch_dict=fetch_dict, fetch_mapper=extended_mapper) as conn:
            return conn.execute(*args, **kwargs)

    def table_names(self):
        with self.execute("select table_name from exa_all_tables where table_schema = current_schema") as stmt:
            return stmt.fetchcol()



class Exasol(DB):
    def __init__(self, name, db):
        super().__init__(name, db)

    def check_data_delayed(self, table):
        return self.db.execute(f"""
            SELECT
                now() - max([{table.time_column}])
            FROM {table.table_name}
        """).fetchone()

    def check_generic(self, func_name, table, checked_column, time_interval):
        interval_part = ""
        if time_interval:
            time_interval = self.make_interval(time_interval)
            interval_part = f"WHERE [{table.time_column}] > now() - {time_interval}"

        result = self.db.execute(
            f"""
            SELECT
                {func_name}([{checked_column}]) as "value"
            FROM
                {table.table_name}
            {interval_part}
            """,
            fetch_dict=True,
        ).fetchone()
        return SimpleNamespace(**result)

    def check_count_nulls(self, table, checked_column, time_interval):
        interval_part = self.make_interval(time_interval)
        result = self.db.execute(
            f"""
            SELECT
                count(*) as "value"
            FROM
                {table.table_name}
            WHERE [{table.time_column}] > now() - {interval_part}
              AND [{checked_column}] IS NULL
            """,
            fetch_dict=True,
        ).fetchone()
        return SimpleNamespace(**result)

    def check_count_per_value(self, table, checked_column, time_interval):
        interval_part = self.make_interval(time_interval)
        distinct_count = self.db.execute(
            f"""
            SELECT
                count(distinct([{checked_column}])) as "count"
            FROM
                {table.table_name}
            WHERE [{table.time_column}] > now() - {interval_part}
            """,
            fetch_dict=True,
        ).fetchval()

        if distinct_count > 10:
            # Skipping if more than 10 different values showing up in column
            # - here we need to return an empty list, as the actual check will still proceed
            return []

        result = self.db.execute(
            f"""
            SELECT
                count(*) as "count",
                [{checked_column}] as "value"
            FROM
                {table.table_name}
            WHERE
                [{table.time_column}] > now() - {interval_part} and
                [{checked_column}] is not null
            GROUP BY
                [{checked_column}]
            ORDER BY
                "count" DESC
            LIMIT 10
            """,
            fetch_dict=True,
        ).fetchall()
        return [SimpleNamespace(**row) for row in result]

    def check_data_volume(self, table, time_interval):
        interval_part = self.db.make_interval(time_interval)
        result = self.db.execute(
            f"""
            SELECT
                count(*) as "count"
            FROM {table.table_name}
            WHERE [{table.time_column}] > now() - {interval_part}
            """,
            fetch_dict=True,
        ).fetchone()
        return SimpleNamespace(**result)
    
    def check_data_volume_diff(self, table, from_time):
        result = self.db.execute(
            f"""
            SELECT
                CAST({table.time_column} AS DATE),
                count(*) as "count"
            FROM {table.table_name}
            WHERE [{table.time_column}] >= '{from_time}'
            GROUP BY CAST({table.time_column} AS DATE)
            """,
            fetch_dict=True,
        ).fetchall()
        return SimpleNamespace(**result)

    def execute(self, *args, **kwargs):
        return self.db.execute(*args, **kwargs)
    
    def get_interval_sep(self):
        raise RuntimeError("use make_interval() to construct INTERVAL parts for Exasol")

    def get_max_timestamp(self, table, column):
        result = self.db.execute(f'SELECT max([{column}]) FROM [{table.table_name}]').fetchval()
        return self.ensure_datetime(result)
    
    def get_age_function(self):
        raise RuntimeError("age function not supported for Exasol")

    def get_table_schema(self, table_name):
        st = self.db.execute(
            """
            /*snapshot execution*/
            SELECT
              column_name AS "name",
              lower(type_name) AS "type"
            FROM sys.exa_all_columns
            LEFT JOIN sys.exa_sql_types ON type_id = column_type_id
            WHERE column_schema = current_schema
                AND column_table = {table_name}
            """,
            {'table_name': table_name.upper()},
            fetch_dict=True,
        )

        res = st.fetchall()
        return res

    def make_interval(self, interval):
        parts=interval.split()
        return f"INTERVAL '{parts[0]}' {parts[1]}"

    @staticmethod
    def numeric_types():
        return [
            'tinyint',
            'smallint',
            'integer',
            'bigint',
            'decimal',
            'float',
            'double precision'
        ]


    @staticmethod
    def character_types():
        return [
            'char',
            'varchar',
            'long varchar'
        ]

    @staticmethod
    def datetime_types():
        return [
            'timestamp',
            'timestamp with local time zone',
            'date'
        ]


def extended_mapper(val, data_type):
    """
    Convert into Python 3 data types as usual:
    DECIMAL(p,0) -> int
    DECIMAL(p,s) -> decimal.Decimal
    DOUBLE       -> float
    DATE         -> datetime.date
    TIMESTAMP    -> datetime.datetime
    BOOLEAN      -> bool
    VARCHAR      -> str
    CHAR         -> str

    ..but with some additional support:
    INTERVAL DAY TO SECOND -> datetime.timedelta

    <others>     -> str
    """

    if val is None:
        return None
    elif data_type['type'] == 'DECIMAL':
        if data_type['scale'] == 0:
            return int(val)
        else:
            return decimal.Decimal(val)
    elif data_type['type'] == 'DATE':
        return datetime.date(int(val[0:4]), int(val[5:7]), int(val[8:10]))
    elif data_type['type'] == 'TIMESTAMP':
        return datetime.datetime(int(val[0:4]), int(val[5:7]), int(val[8:10]),           # year, month, day
                                 int(val[11:13]), int(val[14:16]), int(val[17:19]),      # hour, minute, second
                                 int(val[20:26].ljust(6, '0')) if len(val) > 20 else 0)  # microseconds (if available)
    elif data_type['type'] == 'INTERVAL DAY TO SECOND':
        td = datetime.timedelta(days=int(val[0:10]),
                                hours=int(val[11:13]), minutes=int(val[14:16]), seconds=int(val[17:19]),
                                microseconds=int(round(float(val[20:29].ljust(9, '0'))/1000)) if len(val) > 20 else 0)
        if val[0] == '-':
            # normalize according to Python timedelta rules (days are negative; remaining parts apply back "up" towards 0)
            # - eg. -6 days, 1:00:00.000000 would represent 5 days, 23 hours ago (6 days back, 1 hour forward)
            if td.microseconds > 0:
                seconds = 86399 - td.seconds
                microseconds = 1000000 - td.microseconds
            elif td.seconds > 0:
                seconds = 86400 - td.seconds
                microseconds = 0
            else:
                seconds = 0
                microseconds = 0
            td = datetime.timedelta(
                days=td.days - 1,
                seconds=seconds,
                microseconds=microseconds
            )
        return td
    else:
        return val


def parse_url(url):
    # Parse exa+pyexasol://user:password@hostname:port/schema
    params = urlparse(url)

    default_schema = params.path.strip('/')
    port = params.port or '8563'

    assert params.scheme == 'exa+pyexasol', f"invalid url for Exasol connection: {url}"
    assert params.hostname is not None, f"bad connection URL, missing hostname: {url}"
    assert params.username is not None, f"bad connection URL, missing username: {url}"
    assert params.password is not None, f"bad connection URL, missing password: {url}"
    assert len(default_schema) > 0, f"bad connection URL, missing default schema: {url}"

    return dict(
        dsn=f"{params.hostname}:{port}",
        user=params.username,
        password=params.password,
        schema=default_schema
    )
