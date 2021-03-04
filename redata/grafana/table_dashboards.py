from grafana_api.grafana_face import GrafanaFace

from redata import settings
from redata.db_operations import metrics_db
from redata.grafana.panels.base import ALL_PANELS, CheckForColumn
from redata.grafana.utils import load_json_data, update_panel_element
from redata.metric import Metric


def get_dashboard_for_table(db, table):
    table_data = load_json_data(settings.TABLE_DASHBOARD_LOCATION)

    panels = table_data["panels"]
    per_title = dict([(panel.title(), panel) for panel in ALL_PANELS])

    table_data["title"] = f"source: {db.name} table: {table.table_name} (generated)"

    for panel in panels:
        if per_title.get(panel["title"]):
            panel = update_panel_element(table, panel, per_title[panel["title"]])

    next_id = 20
    y_pos = 20
    x_pos = 0

    check_per_column = {}
    checks = [ch for ch in table.checks if ch.name not in Metric.TABLE_METRICS]

    check_per_column = checks[0].metrics
    # TODO support for more checks here

    for column_name in sorted(check_per_column.keys()):
        if x_pos != 0:
            x_pos = 0
            y_pos += 7

        panel = load_json_data(settings.CUSTOM_ROW_LOCATION)
        panel["title"] = f"{column_name} column"
        panel["id"] = next_id
        panel["gridPos"]["y"] = y_pos
        panel["gridPos"]["x"] = x_pos

        next_id += 1
        y_pos += 1

        panels.append(panel)

        metrics = check_per_column[column_name]

        for metric_name in metrics:
            panel = load_json_data(settings.CUSTOM_PANEL_LOCATION)
            panel["title"] = f"{metric_name}"
            panel["id"] = next_id
            panel["gridPos"]["y"] = y_pos
            panel["gridPos"]["x"] = x_pos

            next_id += 1
            if x_pos == 0:
                x_pos += 12
            else:
                x_pos = 0
                y_pos += 7

            panel = update_panel_element(
                table, panel, CheckForColumn, column=column_name, metric=metric_name
            )

            panels.append(panel)

    return table_data
