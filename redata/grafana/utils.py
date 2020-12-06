import json
from redata import settings


def load_json_data(file_name):
    with open(file_name) as json_file:
        data = json.load(json_file)
    
    return data

def update_panel_element(table, panel, panel_class, **kwargs):
    panel_obj = panel_class(table, **kwargs)
    targets = load_json_data(settings.TARGETS_DASHBOARD_LOCATION)

    targets[0]['format'] = panel_obj.format()
    targets[0]['rawSql'] = panel_obj.query()
    panel['targets'] = targets

    return panel


def update_home_panel_element(panel, panel_class, **kwargs):
    panel_obj = panel_class(**kwargs)
    targets = load_json_data(settings.TARGETS_DASHBOARD_LOCATION)

    targets[0]['format'] = panel_obj.format()
    targets[0]['rawSql'] = panel_obj.query()
    panel['targets'] = targets

    return panel