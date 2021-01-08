from redata.backends.base import DB
import datetime


class Exasol(DB):
    def __init__(self, name, db):
        super().__init__(name, db)

    def execute(self, *args, **kwargs):
        with pyexasol.connect(**self.db, fetch_mapper=extended_mapper) as conn:
            return conn.execute(*args, **kwargs)

    @staticmethod
    def numeric_types():
        return [
            'tinyint',
            'smallint',
            'int',
            'integer',
            'bigint',
            'decimal',
            'dec',
            'float',
            'double',
            'double precision'
        ]

    @staticmethod
    def character_types():
        return [
            'char',
            'varchar',
            'blob',
            'tinyblob',
            'tinytext',
            'mediumblob',
            'mediumtext',
            'longblob',
            'longtext',
            'enum'
        ]
    

    def get_interval_sep(self):
        return ""
    
    def get_age_function(self):
        return "timediff"


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
