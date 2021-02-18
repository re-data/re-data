
class HomeLastModifiedTime():

    def format(self):
        return 'time_series'

    @staticmethod
    def title():
        return 'time_since_last_record_created'

    def query(self):
        return f"""
            SELECT
                metric.created_at AS time,
                m.table_name,
                (metric.result->>'value')::float
            FROM metric metric, monitored_table m
            WHERE
                m.id = metric.table_id and
                m.active = true and
                metric.metric = 'check_data_delayed' and
                $__timeFilter(metric.created_at)
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
                metric.created_at AS time,
                m.table_name,
                (metric.result->>'value')::float
            FROM metric metric, monitored_table m
            WHERE
                m.id = metric.table_id and
                m.active = true and
                metric.metric = 'check_data_volume' and
                params ->> 'time_interval' = '1 day' and
                $__timeFilter(metric.created_at)
        """ 

class HomeAlerts():

    def format(self):
        return 'table'
    
    @staticmethod
    def title():
        return 'recent_alerts'
    
    def query(self):
        return f"""
            SELECT
                m.table_name,
                alert.text,
                alert.alert_type,
                alert.created_at
            FROM
                alerts_alert alert,
                monitored_table m
            WHERE
                alert.table_id = m.id AND
                $__timeFilter(alert.created_at)
            ORDER BY
                alert.created_at DESC
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
            result -> 'value' ->> 'operation' as operation,
            result -> 'value' ->> 'column_name' as column_name,
            result -> 'value' ->> 'columnt_type' as column_type
        FROM metric
        WHERE
            table_id = {self.table.id} and
            metric = 'check_if_schema_changed' and
            $__timeFilter(created_at)
        ORDER BY 1
        """


class AlertsTable():
    def __init__(self, table):
        self.table = table

    def format(self):
        return 'table'
    
    @staticmethod
    def title():
        return 'recent_alerts'
    
    def query(self):
        return f"""
            SELECT
                alert.text,
                alert.alert_type,
                alert.created_at
            FROM
                alerts_alert alert
            WHERE
                table_id = {self.table.id} and
                $__timeFilter(alert.created_at)
            ORDER BY
                alert.created_at DESC
        """

class AlertsByDay():
    def __init__(self, table):
        self.table = table

    def format(self):
        return 'time_series'
    
    @staticmethod
    def title():
        return 'alerts_by_day'

    def query(self):
        return f"""
            SELECT
                alert.created_at::date as time,
                alert.alert_type,
                count(*)
            FROM
                alerts_alert alert
            WHERE
                table_id = {self.table.id} and
                $__timeFilter(alert.created_at)
            GROUP BY
                alert.created_at::date, alert.alert_type
            ORDER BY
                alert.created_at::date DESC
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
            (result ->> 'value')::float as delay
        FROM metric
        WHERE
            table_id = {self.table.id} and
            metric = 'check_data_delayed' and
            $__timeFilter(created_at)
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
            (result ->> 'value')::float as volume_24h
        FROM metric
        WHERE
            table_id = {self.table.id} and
            metric = 'check_data_volume' and
            params ->> 'time_interval' = '1 day' and
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

ALL_PANELS = VolumeGraphs, DelayOnTable, SchemaChange, CurrentSchema, AlertsTable, AlertsByDay
