from redata.backends.base import DB
from redata.backends.sql_alchemy import SqlAlchemy

class MySQL(SqlAlchemy):

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