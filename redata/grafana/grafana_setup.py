import pdb
from redata import db_operations
from grafana_api.grafana_face import GrafanaFace

import subprocess
import json
import tempfile

from redata import settings
from redata.grafana.source import get_postgres_datasource
from redata.grafana.home_dashboard import create_home_dashboard
from redata.grafana.table_dashboards import get_dashboard_for_table
from redata.models.table import MonitoredTable
from grafana_api.grafana_api import GrafanaClientError
from redata.db_operations import source_dbs
from redata.grafana.utils import load_json_data


def create_source_in_grafana(grafana_api):
    datasource = get_postgres_datasource()
    try:
        source = grafana_api.datasource.get_datasource_by_name(datasource['name'])
    except GrafanaClientError:
        print (grafana_api.datasource.create_datasource(datasource))

def create_dashboard_for_table(grafana_api, db, table):
    data = get_dashboard_for_table(db, table)

    response = grafana_api.dashboard.update_dashboard(
        dashboard={
            'dashboard': data,
            'folderID': 0,
            'overwrite': True
        }
    )
    print (f"Dashboard for table: {table.table_name} generated:", response)

    return {
        'table': table,
        'dashboard': response
    }

def star_home_dashboard(grafana_api,home_response):
    response = grafana_api.user.star_actual_user_dashboard(home_response['id'])
    print('Home dashboard starred')
    return response



def create_dashboards():
    grafana_api = GrafanaFace(
        auth=(settings.GF_SECURITY_ADMIN_USER, settings.GF_SECURITY_ADMIN_PASSWORD),
        host='grafana:3000'
    )

    create_source_in_grafana(grafana_api)
    dashboards = []

    for db in source_dbs:
        monitored_tables = MonitoredTable.get_monitored_tables(db.name)
        for table in monitored_tables:
            dash_data = create_dashboard_for_table(grafana_api, db, table)
            dashboards.append(dash_data)

    home_response = create_home_dashboard(grafana_api, dashboards)
    star_home_dashboard(grafana_api, response)



