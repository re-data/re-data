from redata.backends.base import DB
from redata.backends.sql_alchemy import SqlAlchemy


class SQLServer(SqlAlchemy):
    @staticmethod
    def numeric_types():
        return [
            "bit",
            "decimal",
            "numeric",
            "float",
            "real",
            "int",
            "bigint",
            "smallint",
            "tinyint",
            "money",
            "smallmoney",
        ]

    @staticmethod
    def character_types():
        return [
            "char",
            "varchar",
            "binary",
            "varbinary",
            "String",
            "ntext",
            "text",
            "nchar",
            "nvarchar",
        ]

    @staticmethod
    def datetime_types():
        return ["datetime", "datetime2", "date", "smalldatetime"]
