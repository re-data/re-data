

class SchemaChange():

    def __init__(self, table_name) -> None:
        self.table_name = table_name

    def format(self):
        return 'table'

    @staticmethod
    def title():
        return 'schema_changes'

    def query(self):
        return """
        SELECT
            created_at AS "time",
            operation,
            column_name,
            column_type
        FROM metrics_table_schema_changes
        WHERE
            table_name = '{table_name}' and
            $__timeFilter(created_at)
        ORDER BY 1
        """.format(table_name=self.table_name)


class CurrentSchema():
    def __init__(self, table_name):
        self.table_name = table_name
    
    def format(self):
        return 'table'

    @staticmethod
    def title():
        return 'current_table_schema'

    def query(self):
        super().__init__()
        return """
        SELECT
            col.*
        FROM
            monitored_table,
            jsonb_to_recordset(schema->'columns') col(name text, type text)
        WHERE
            table_name = '{table_name}'
        """.format(table_name=self.table_name)

class DelayOnTable():

    def __init__(self, table_name) -> None:
        self.table_name = table_name

    def format(self):
        return 'time_series'

    @staticmethod
    def title():
        return f'time_since_last_record_created'

    def query(self):
        return """
        SELECT
            created_at AS "time",
            value as "time_since_last_record_created"
        FROM metrics_data_delay
        WHERE
            table_name = '{table_name}' and
            $__timeFilter(created_at)
        ORDER BY 1
        """.format(table_name=self.table_name)


class GroupByDate():

    def __init__(self, table_name) -> None:
        self.table_name = table_name

    def format(self):
        return 'time_series'

    @staticmethod
    def title():
        return f'new_records_by_day'

    def query(self):
        return """
        SELECT
            created_at::date AS "time",
            sum(count)
        FROM metrics_data_volume_diff
        WHERE
            table_name = '{table_name}' and
            $__timeFilter(created_at)
        GROUP BY 1    
        ORDER BY 1
        """.format(table_name=self.table_name)


class VolumeGraphs():
    
    def __init__(self, table_name) -> None:
        self.table_name = table_name

    def format(self):
        return 'time_series'

    @staticmethod
    def title():
        return f'new_record_created'

    def query(self):
        return """
        SELECT
            created_at AS "time",
            time_interval,
            count
        FROM metrics_data_volume
        WHERE
            table_name = '{table_name}' and
            $__timeFilter(created_at)
        ORDER BY 1
        """.format(table_name=self.table_name)


class CheckForColumn():
    
    def __init__(self, table_name, column_name, check_name) -> None:
        self.table_name = table_name
        self.column_name = column_name
        self.check_name = check_name

    def format(self):
        return 'time_series'
    
    @staticmethod
    def title():
        return f'NOT_EXISTING'

    def title_for_obj(self):
        return 'column:{self.column_name}:{self.check_name}'

    def query(self):
        return f"""
        SELECT
            created_at as time, time_interval, check_value
        FROM
            metrics_data_values
        WHERE
            table_name = '{self.table_name}' and
            column_name = '{self.column_name}' and
            check_name='{self.check_name}'
        ORDER BY
        1
        """

ALL_PANELS = VolumeGraphs, DelayOnTable, GroupByDate, SchemaChange, CurrentSchema