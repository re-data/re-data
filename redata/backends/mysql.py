from redata.backends.base import DB

class MySQL(DB):
    def __init__(self, name, db):
        super().__init__(name, db)

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

    @staticmethod
    def datetime_types():
        return [
            'datetime',
            'timestamp',
            'date'
        ]

    def get_interval_sep(self):
        return ""
    
    def get_age_function(self):
        return "timediff"
