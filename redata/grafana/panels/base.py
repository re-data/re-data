from redata import settings
from grafanalib.core import (
    Alert, AlertCondition, Dashboard, Graph, Table, SingleStat,
    GreaterThan, OP_AND, OPS_FORMAT, Row, RTYPE_SUM, SECONDS_FORMAT,
    SHORT_FORMAT, single_y_axis, Target, TimeRange, YAxes, YAxis
)
import attr

class GrafanaPanel:

    def title(self):
        pass
    
    def query(self):
        pass

    def targets(self):
        pass

    def datasource(self):
        return settings.REDATA_GRAFANA_SOURCE


    def getPanel(self):
        pass


class GrafanaGraphPanel(GrafanaPanel):
    
    def yAxes(self):
        return single_y_axis(format='none'),

    def getPanel(self):
        graph = Graph(
            title=self.title(),
            dataSource=self.datasource(),
            yAxes=self.yAxes(),
            targets=self.targets()
        )
        return graph

class GrafanaTablePanel(GrafanaPanel):
   
    def getPanel(self):
        graph = Table(
            title=self.title(),
            dataSource=self.datasource(),
            targets=self.targets(),
            span=self.span
        )
        return graph

class StatPanel(GrafanaPanel):

    def targets(self):
        return [
            {
                "format": "time_series",
                "group": [],
                "hide": False,
                "metricColumn": "none",
                "rawQuery": True,
                "rawSql": self.query(),
                "refId": "A",
            }
        ]
   
    def getPanel(self):
        graph = SingleStat(
            title=self.title(),
            dataSource=self.datasource(),
            targets=self.targets(),
            span=self.span
        )
        return graph

class PostgresTimeSeries(GrafanaGraphPanel):

    def targets(self):
        return [
            {
                "format": "time_series",
                "group": [],
                "hide": False,
                "metricColumn": "none",
                "rawQuery": True,
                "rawSql": self.query(),
                "refId": "A",
            }
        ]


class SchemaChange(GrafanaTablePanel):

    def __init__(self, table_name) -> None:
        self.table_name = table_name
        self.span = 4

    def title(self):
        return f'{self.table_name} curr_delay'

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

    def targets(self):
        return [
            {
                "format": "table",
                "group": [],
                "hide": False,
                "metricColumn": "none",
                "rawQuery": True,
                "rawSql": self.query(),
                "refId": "A",
            }
        ]

class DelayOnTable(StatPanel):

    def __init__(self, table_name) -> None:
        self.table_name = table_name
        self.span = 4

    def title(self):
        return f'time_since_last_record_added'

    def query(self):
        return """
        SELECT
            created_at AS "time",
            value
        FROM metrics_data_delay
        WHERE
            table_name = '{table_name}' and
            $__timeFilter(created_at)
        ORDER BY 1
        """.format(table_name=self.table_name)


class VolumeGraphs(StatPanel):
    
    def __init__(self, table_name) -> None:
        self.table_name = table_name
        self.span = 12

    def title(self):
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
