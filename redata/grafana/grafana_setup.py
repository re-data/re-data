import pdb
from redata import db_operations
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
from redata import settings
from redata.grafana.dashboard import get_dashboard_for_table
from redata.grafana.source import get_postgres_datasource

def dashboard_to_json(dashboard):
    result = json.dumps(
        dashboard.to_json_data(), sort_keys=True, indent=2,
        cls=DashboardEncoder
    )
    return result

def load_json_dashboard(file_name):
    with open(file_name) as json_file:
        data = json.load(json_file)
    
    return data

grafana_api = GrafanaFace(
    auth=(settings.GF_SECURITY_ADMIN_USER, settings.GF_SECURITY_ADMIN_PASSWORD),
    host='localhost:3000'
)

if __name__ == "__main__":

    home_data = load_json_dashboard('grafana/templates/home.json')
    print (grafana_api.dashboard.update_dashboard(
        dashboard={
            'dashboard': home_data,
            'folderID': 0,
            'overwrite': True
        }
    ))


    datasource = get_postgres_datasource()
    source = grafana_api.datasource.get_datasource_by_name(datasource['name'])

    if not source:
        print (grafana_api.datasource.create_datasource(datasource))

    for table in get_monitored_tables():

        dashboard, override = get_dashboard_for_table(table)

        x = dashboard_to_json(dashboard)
        data = json.loads(x)
        data = override(data)

        print (grafana_api.dashboard.update_dashboard(
            dashboard={
                'dashboard': data,
                'folderID': 0,
                'overwrite': True
            }
        ))