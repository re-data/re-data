import json
from redata import settings
from redata.db_operations import grafana_db, metrics_db
from grafana_api.grafana_face import GrafanaFace
from redata.grafana.panels.base import ALL_PANELS, CheckForColumn, CheckForColumnByValue

def load_json_data(file_name):
    with open(file_name) as json_file:
        data = json.load(json_file)
    
    return data

def update_panel_element(table, panel, panel_class, **kwargs):
    panel_obj = panel_class(table.table_name, **kwargs)
    targets = load_json_data(settings.TARGETS_DASHBOARD_LOCATION)

    targets[0]['format'] = panel_obj.format()
    targets[0]['rawSql'] = panel_obj.query()
    panel['targets'] = targets

    return panel


def get_dashboard_for_table(table):
    table_data = load_json_data(settings.TABLE_DASHBOARD_LOCATION)

    panels = table_data['panels']
    per_title = dict(
        [(panel.title(), panel) for panel in ALL_PANELS]
    )

    table_data['title'] = "table:" + table.table_name + " (generated)"

    for panel in panels:
        if per_title.get(panel['title']):
            panel = update_panel_element(table, panel, per_title[panel['title']])


    all_checks = metrics_db.execute(f"""
        SELECT DISTINCT column_name, check_name
        FROM metrics_data_values
        WHERE table_name = '{table.table_name}'
        """
    )
    
    next_id = 20
    y_pos = 20
    x_pos = 0

    check_per_column = {}
    for column_name, check_name in all_checks:
        if column_name not in check_per_column:
            check_per_column[column_name] = [check_name]
        else:
            check_per_column[column_name].append(check_name)

    for column_name in sorted(check_per_column.keys()):
        if x_pos != 0:
            x_pos = 0
            y_pos += 7

        panel = load_json_data(settings.CUSTOM_ROW_LOCATION)
        panel['title'] = f"check for {column_name} column"
        panel['id'] = next_id
        panel['gridPos']["y"] = y_pos
        panel['gridPos']["x"] = x_pos

        next_id += 1
        y_pos += 1

        panels.append(panel)

        checks = check_per_column[column_name]

        for check_name in checks:
            panel = load_json_data(settings.CUSTOM_PANEL_LOCATION)
            panel['title'] = f"{check_name}"
            panel['id'] = next_id
            panel['gridPos']["y"] = y_pos
            panel['gridPos']["x"] = x_pos

            next_id += 1
            if x_pos == 0:
                x_pos += 12
            else:
                x_pos = 0
                y_pos += 7

            if check_name != 'check_count_per_value':
                panel = update_panel_element(
                    table, panel, CheckForColumn,
                    column_name=column_name, check_name=check_name
                )
            else:
                panel = update_panel_element(
                    table, panel, CheckForColumnByValue,
                    column_name=column_name, check_name=check_name, time_interval='1 day'
                )
            panels.append(panel)
            print (f"panel " + panel['title'] + " added")

    return table_data