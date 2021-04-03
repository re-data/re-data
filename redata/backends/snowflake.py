from redata.backends.sql_alchemy import SqlAlchemy


class Snowflake(SqlAlchemy):
    @staticmethod
    def numeric_types():
        return [
            "NUMBER",
            "DECIMAL",
            "NUMERIC",
            "INT",
            "INTEGER",
            "BIGINT",
            "SMALLINT",
            "TINYINT",
            "BYTEINT",
            "FLOAT",
            "FLOAT4",
            "FLOAT8",
            "DOUBLE",
            "DOUBLE PRECISION",
            "REAL",
        ]

    @staticmethod
    def character_types():
        return ["VARCHAR", "CHAR", "CHARACTER", "STRING", "TEXT"]

    @staticmethod
    def datetime_types():
        return [
            "DATE",
            "DATETIME",
            "TIME",
            "TIMESTAMP",
            "TIMESTAMP_LTZ",
            "TIMESTAMP_NTZ",
            "TIMESTAMP_TZ",
        ]

    def get_table_schema(self, table_name, namespace):
        schema_check = (
            f"and lower(table_schema) = '{namespace.lower()}'" if namespace else ""
        )
        result = self.db.execute(
            f"""
            SELECT 
                lower(column_name) as name,
                data_type as type,
                is_nullable as nullable
            FROM 
                information_schema.columns
            WHERE 
                lower(table_name) = '{table_name.lower()}'
                {schema_check}
        """
        )
        return result.fetchall()
