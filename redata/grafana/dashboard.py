import pdb
from grafanalib.core import (
    Alert, AlertCondition, Dashboard, Graph,
    GreaterThan, OP_AND, OPS_FORMAT, Row, RTYPE_SUM, SECONDS_FORMAT,
    SHORT_FORMAT, single_y_axis, Target, TimeRange, YAxes, YAxis, Time
)
from redata.db_operations import get_current_table_schema
from redata.checks.data_values import TYPE_CHECK_MAP
from redata import settings
from redata.grafana.panels.base import DelayOnTable, SchemaChange, VolumeGraphs

    
def get_single_panel(table, column, check_name, check_sql):
    graph = Graph(
        title=f'{table}:{column} {check_name}',
        dataSource=settings.REDATA_GRAFANA_SOURCE,
        targets=[
            {
                "format": "time_series",
                "group": [],
                "hide": False,
                "metricColumn": "none",
                "rawQuery": True,
                "rawSql": check_sql.format(table, column),
                "refId": "A",
            },
        ],
        yAxes=single_y_axis(format='none'),
    )
    return graph

def custom_override(data):
    for i in range(0, 2):
        data['rows'][i]['panels'][0]['type'] = 'stat'
        data['rows'][i]['panels'][0]['fieldConfig'] = {
            "defaults": {
                "color": {
                    "mode": "continuous-blues" 
                },
                "unit": "s" if i == 1 else "short"
            }
        }
        data['rows'][i]['panels'][0]['options'] = {
            "colorMode": "background",
            "graphMode": "area",
            "justifyMode": "auto",
            "orientation": "auto",
            "reduceOptions": {
            "calcs": [
                "last"
            ],
            "fields": "",
            "values": False
            },
            "textMode": "auto"
        }
    
    data['rows'][1]['panels'][2]['type'] = 'table'
    data['rows'][i]['panels'][2]['fieldConfig'] = {
        "defaults": {
            "color": {
                "mode": "continuous-blues" 
            },
        }
    }
        

    return data

def get_dashboard_for_table(table_name):
    schema = get_current_table_schema(table_name)
    all_rows = []

    all_rows.append(
        Row(panels=[
            VolumeGraphs(table_name=table_name).getPanel(),
            
        ])
    )

    all_rows.append(
        Row(panels=[
            DelayOnTable(table_name).getPanel(),
            SchemaChange(table_name).getPanel(),
            SchemaChange(table_name).getPanel(),
        ])
    )

    for col_dict in schema:
        col_name = col_dict['name']
        col_type = col_dict['type']

        for check_dict in TYPE_CHECK_MAP.get(col_type, []):

            all_rows.append(
                Row(panels=[
                    get_single_panel(
                        table_name,
                        col_name, 
                        check_dict['name'],
                        check_dict['metrics_query']
                    )
                ])
            )

    dashboard = Dashboard(
        title=f"table:{table_name}",
        rows=all_rows,
        time=Time('now-24h', 'now')
    ).auto_panel_ids()

    pdb

    return dashboard, custom_override


