import pdb
from redata.checks.data_schema import get_monitored_tables
from grafana_api.grafana_face import GrafanaFace
from grafanalib.core import (
    Alert, AlertCondition, Dashboard, Graph,
    GreaterThan, OP_AND, OPS_FORMAT, Row, RTYPE_SUM, SECONDS_FORMAT,
    SHORT_FORMAT, single_y_axis, Target, TimeRange, YAxes, YAxis
)
import subprocess
import json
import tempfile

from grafanalib._gen import DashboardEncoder
from redata.checks.data_schema import get_monitored_tables

def dashboard_to_json(dashboard):
    result = json.dumps(
        dashboard.to_json_data(), sort_keys=True, indent=2,
        cls=DashboardEncoder
    )
    return result

dashboard = Dashboard(
    title="Testing dashboard 2",
    rows=[
        Row(panels=[
          Graph(
              title="my db",
              dataSource='Metrics DB',
              targets=[
                  {
                    "format": "time_series",
                    "group": [],
                    "hide": False,
                    "metricColumn": "none",
                    "rawQuery": True,
                    "rawSql": "SELECT\n  $__time(created_at),\n  time_interval,\n  count\nFROM\n  metrics_data_volume\nWHERE\n  $__timeFilter(created_at) \nORDER by\n  created_at desc",
                    "refId": "A",
                },
              ],
              yAxes=single_y_axis(format=SECONDS_FORMAT),
          ),
          Graph(
              title="my db 2",
              dataSource='Metrics DB',
              targets=[
                  {
                    "format": "time_series",
                    "group": [],
                    "hide": False,
                    "metricColumn": "none",
                    "rawQuery": True,
                    "rawSql": "SELECT\n  $__time(created_at),\n  time_interval,\n  count\nFROM\n  metrics_data_volume\nWHERE\n  $__timeFilter(created_at) \nORDER by\n  created_at desc",
                    "refId": "A",
                },
              ],
              yAxes=single_y_axis(format=SECONDS_FORMAT),
          ),
        ]),
        Row(panels=[
          Graph(
              title="my db",
              dataSource='Metrics DB',
              targets=[
                  {
                    "format": "time_series",
                    "group": [],
                    "hide": False,
                    "metricColumn": "none",
                    "rawQuery": True,
                    "rawSql": "SELECT\n  $__time(created_at),\n  time_interval,\n  count\nFROM\n  metrics_data_volume\nWHERE\n  $__timeFilter(created_at) \nORDER by\n  created_at desc",
                    "refId": "A",
                },
              ],
              yAxes=single_y_axis(format=SECONDS_FORMAT),
          ),
          Graph(
              title="my db 2",
              dataSource='Metrics DB',
              targets=[
                  {
                    "format": "time_series",
                    "group": [],
                    "hide": False,
                    "metricColumn": "none",
                    "rawQuery": True,
                    "rawSql": "SELECT\n  $__time(created_at),\n  time_interval,\n  count\nFROM\n  metrics_data_volume\nWHERE\n  $__timeFilter(created_at) \nORDER by\n  created_at desc",
                    "refId": "A",
                },
              ],
              yAxes=single_y_axis(format=SECONDS_FORMAT),
          ),
          Graph(
              title="my db 2",
              dataSource='Metrics DB',
              targets=[
                  {
                    "format": "time_series",
                    "group": [],
                    "hide": False,
                    "metricColumn": "none",
                    "rawQuery": True,
                    "rawSql": "SELECT\n  $__time(created_at),\n  time_interval,\n  count\nFROM\n  metrics_data_volume\nWHERE\n  $__timeFilter(created_at) \nORDER by\n  created_at desc",
                    "refId": "A",
                },
              ],
              yAxes=single_y_axis(format=SECONDS_FORMAT),
          ),
        ]),
    ],
).auto_panel_ids()

grafana_api = GrafanaFace(
    auth=("admin","admin"),
    host='192.168.99.100:3001'
)

if __name__ == "__main__":

    for table in get_monitored_tables():
        dashboard.title = table

        x = dashboard_to_json(dashboard)
        data = json.loads(x)

        print (grafana_api.dashboard.update_dashboard(
            dashboard={
                'dashboard': data,
                'folderID': 0,
                'overwrite': True
            }
        ))