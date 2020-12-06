
class HomeLastModifiedTime():

    def format(self):
        return 'time_series'

    @staticmethod
    def title():
        return 'time_since_last_record_created'

    def query(self):
        return f"""
            SELECT
                delay.created_at AS time,
                m.table_name,
                delay.value
            FROM metrics_data_delay delay, monitored_table m
            WHERE
                m.id = delay.table_id and
                $__timeFilter(delay.created_at)
            ORDER BY 1
        """ 


class HomeLastDayTraffic():

    def format(self):
        return 'time_series'

    @staticmethod
    def title():
        return 'new_records_created (in last 24h)'

    def query(self):
        return f"""
            SELECT
                volume.created_at AS time,
                m.table_name,
                volume.count
            FROM
                metrics_data_volume volume,
                monitored_table m
            WHERE
                volume.time_interval = '1 day' and
                m.id = volume.table_id and
                $__timeFilter(volume.created_at)
            ORDER BY 1
        """ 


class SchemaChange():

    def __init__(self, table) -> None:
        self.table = table

    def format(self):
        return 'table'

    @staticmethod
    def title():
        return 'schema_changes'

    def query(self):
        return f"""
        SELECT
            created_at AS "time",
            operation,
            column_name,
            column_type
        FROM metrics_table_schema_changes
        WHERE
            table_id = {self.table.id} and
            $__timeFilter(created_at)
        ORDER BY 1
        """


class CurrentSchema():
    def __init__(self, table):
        self.table = table
    
    def format(self):
        return 'table'

    @staticmethod
    def title():
        return 'current_table_schema'

    def query(self):
        return f"""
        SELECT
            col.*
        FROM
            monitored_table,
            jsonb_to_recordset(schema->'columns') col(name text, type text)
        WHERE
            id = {self.table.id}
        """

class DelayOnTable():

    def __init__(self, table) -> None:
        self.table = table

    def format(self):
        return 'time_series'

    @staticmethod
    def title():
        return f'time_since_last_record_created'

    def query(self):
        return f"""
        SELECT
            created_at AS "time",
            value as "time_since_last_record_created"
        FROM metrics_data_delay
        WHERE
            table_id = {self.table.id} and
            $__timeFilter(created_at)
        ORDER BY 1
        """


class GroupByDate():

    def __init__(self, table) -> None:
        self.table = table

    def format(self):
        return 'time_series'

    @staticmethod
    def title():
        return f'new_records_by_day'

    def query(self):
        return f"""
        SELECT
            created_at::date AS "time",
            sum(count)
        FROM metrics_data_volume_diff
        WHERE
            table_id = {self.table.id} and
            $__timeFilter(created_at)
        GROUP BY 1    
        ORDER BY 1
        """


class VolumeGraphs():
    
    def __init__(self, table) -> None:
        self.table = table

    def format(self):
        return 'time_series'

    @staticmethod
    def title():
        return f'new_record_created'

    def query(self):
        return f"""
        SELECT
            created_at AS "time",
            time_interval,
            count
        FROM metrics_data_volume
        WHERE
            table_id = {self.table.id} and
            $__timeFilter(created_at)
        ORDER BY 1
        """


class CheckForColumn():
    
    def __init__(self, table, column_name, check_name) -> None:
        self.table = table
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
            table_id = {self.table.id} and
            column_name = '{self.column_name}' and
            check_name='{self.check_name}'
        ORDER BY
        1
        """

class CheckForColumnByValue():
        
    def __init__(self, table, column_name, check_name, time_interval) -> None:
        self.table = table
        self.column_name = column_name
        self.check_name = check_name
        self.time_interval = time_interval

    def format(self):
        return 'time_series'
    
    def query(self):
        return f"""
        SELECT
            created_at as time, column_value, check_value
        FROM
            metrics_data_values
        WHERE
            table_id = {self.table.id} and
            column_name = '{self.column_name}' and
            check_name='{self.check_name}' and
            time_interval = '{self.time_interval}' and
            column_value is not null
        ORDER BY
        1
        """

ALL_PANELS = VolumeGraphs, DelayOnTable, GroupByDate, SchemaChange, CurrentSchema
