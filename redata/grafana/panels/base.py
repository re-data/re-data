from redata import settings
from grafanalib.core import (
    Alert, AlertCondition, Dashboard, Graph, Table,
    GreaterThan, OP_AND, OPS_FORMAT, Row, RTYPE_SUM, SECONDS_FORMAT,
    SHORT_FORMAT, single_y_axis, Target, TimeRange, YAxes, YAxis
)

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
            targets=self.targets()
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

class DelayOnTable(PostgresTimeSeries):

    def __init__(self, table_name) -> None:
        self.table_name = table_name

    def title(self):
        return f'{self.table_name} curr_delay'

    def yAxes(self):
        return single_y_axis(format='s')

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


class SchemaChange(GrafanaTablePanel):

    def __init__(self, table_name) -> None:
        self.table_name = table_name

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
            column_type,
            column_count
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