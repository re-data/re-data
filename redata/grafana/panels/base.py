from redata import settings
from grafanalib.core import (
    Alert, AlertCondition, Dashboard, Graph, Table, SingleStat,
    GreaterThan, OP_AND, OPS_FORMAT, Row, RTYPE_SUM, SECONDS_FORMAT,
    SHORT_FORMAT, single_y_axis, Target, TimeRange, YAxes, YAxis
)
import attr

class SchemaChange():

    def __init__(self, table_name) -> None:
        self.table_name = table_name
        self.span = 4

    @staticmethod
    def title():
        return f'schema_changes'

    def yAxes(self):
        return single_y_axis(format='s')

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

class DelayOnTable():

    def __init__(self, table_name) -> None:
        self.table_name = table_name
        self.span = 4

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

ALL_PANELS = VolumeGraphs, DelayOnTable, GroupByDate