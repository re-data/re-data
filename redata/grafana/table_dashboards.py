import json
from redata import settings
from redata.db_operations import grafana_db
from grafana_api.grafana_face import GrafanaFace
from redata.grafana.panels.base import ALL_PANELS

def load_json_data(file_name):
    with open(file_name) as json_file:
        data = json.load(json_file)
    
    return data

def update_panel_element(table_name, panel, panel_class):
    panel_obj = panel_class(table_name)
    targets = load_json_data(settings.TARGETS_DASHBOARD_LOCATION)

    targets[0]['format'] = panel_obj.format()
    targets[0]['rawSql'] = panel_obj.query()
    panel['targets'] = targets

    return panel


def get_dashboard_for_table(table_name):
    table_data = load_json_data(settings.TABLE_DASHBOARD_LOCATION)

    panels = table_data['panels']
    per_title = dict(
        [(panel.title(), panel) for panel in ALL_PANELS]
    )

    table_data['title'] = "table:" + table_name + " (generated)"

    for panel in panels:
        if per_title.get(panel['title']):
            panel = update_panel_element(table_name, panel, per_title[panel['title']])

    return table_data