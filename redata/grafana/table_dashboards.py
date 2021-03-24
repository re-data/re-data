from grafana_api.grafana_face import GrafanaFace

from redata import settings
from redata.db_operations import metrics_db
from redata.grafana.panels.base import ALL_PANELS, CheckForColumn
from redata.grafana.utils import load_json_data, update_panel_element
from redata.metric import Metric


def get_all_metrics_for_table(table):
    metrics_per_col = {}
    for chk in table.checks:
        metrics = chk.metrics
        for col, col_metrics in metrics.items():
            if col not in metrics_per_col:
                metrics_per_col[col] = []

            metrics_per_col[col].extend(col_metrics)
    return metrics_per_col


def get_dashboard_for_table(db, table):
    table_data = load_json_data(settings.TABLE_DASHBOARD_LOCATION)

    panels = table_data["panels"]
    per_title = dict([(panel.title(), panel) for panel in ALL_PANELS])

    table_data["title"] = f"{db.name.upper()}:{table.full_table_name.upper()}"

    for panel in panels:
        if per_title.get(panel["title"]):
            panel = update_panel_element(table, panel, per_title[panel["title"]])

    next_id = 20
    y_pos = 20
    x_pos = 0

    check_per_column = {}

    metric_per_column = get_all_metrics_for_table(table)

    for column_name, metrics in metric_per_column.items():
        if x_pos != 0:
            x_pos = 0
            y_pos += 7

        if column_name == Metric.TABLE_METRIC:
            # We display those metrics in different places
            metrics.remove(Metric.COUNT)
            metrics.remove(Metric.SCHEMA_CHANGE)
            metrics.remove(Metric.DELAY)
            title = "CUSTOM TABLE STATS"
        else:
            title = f"COL:{column_name.upper()}"

        if len(metrics) == 0:
            continue

        panel = load_json_data(settings.CUSTOM_ROW_LOCATION)
        panel["title"] = title
        panel["id"] = next_id
        panel["gridPos"]["y"] = y_pos
        panel["gridPos"]["x"] = x_pos

        next_id += 1
        y_pos += 1

        panels.append(panel)

        for metric_name in metrics:
            panel = load_json_data(settings.CUSTOM_PANEL_LOCATION)
            panel["title"] = f"{metric_name.upper()}"
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
