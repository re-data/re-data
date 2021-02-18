from redata import settings
from redata.db_operations import metrics_db
from grafana_api.grafana_face import GrafanaFace
from redata.grafana.panels.base import ALL_PANELS, CheckForColumn, CheckForColumnByValue
from redata.grafana.utils import load_json_data, update_panel_element


def get_dashboard_for_table(db, table):
    table_data = load_json_data(settings.TABLE_DASHBOARD_LOCATION)

    base_panels = table_data['panels']
    per_title = dict(
        [(panel.title(), panel) for panel in ALL_PANELS]
    )

    table_data['title'] = f"source: {db.name} table: {table.table_name} (generated)"

    for panel in base_panels:
        if per_title.get(panel['title']):
            panel = update_panel_element(table, panel, per_title[panel['title']])

    all_checks = table.checks
    return table_data
    
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
        panel['title'] = f"{column_name} column"
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

    return table_data