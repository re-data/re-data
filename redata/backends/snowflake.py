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
        schema_check = f"and lower(table_schema) = '{namespace}'" if namespace else ""
        result = self.db.execute(
            f"""
            SELECT 
                column_name, 
                data_type 
            FROM 
                information_schema.columns
            WHERE 
                lower(table_name) = '{table_name}'
                {schema_check}
        """
        )
        return [{"name": c_name, "type": c_type} for c_name, c_type in result]
