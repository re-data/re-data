import flask_login as login
from flask import Blueprint, Flask, Markup, redirect, request, url_for

from redata.ui_admin.utils import (
    BaseRedataView,
    formatted_time,
    grafana_url_formatter_fun,
    table_details_link_formatter,
)


class TableView(BaseRedataView):
    can_delete = False
    can_view_details = True
    can_create = False

    def is_accessible(self):
        return login.current_user.is_authenticated

    def grafana_url_formatter(self, context, model, name):
        return grafana_url_formatter_fun(model)

    def schema_formatter(self, context, model, schema):
        max_length = max([len(x["name"]) for x in model.schema["columns"]])

        str_repr = "<br/>".join(
            f"{row['name'].ljust(max_length + 2, '§')} [{row['type']}]"
            for row in model.schema["columns"]
        )
        str_repr = str_repr.replace("§", "&nbsp;")
        return Markup('<div class="schema-repr">' + str_repr + "</div")

    def alerts_formatter(self, context, model, schema):
        table_alerts = []
        for alert in model.alerts_by_creation:
            created_at = formatted_time(alert.created_at)
            table_alerts.append(f"[{created_at}] {alert.text}")

        str_rep = "<br/>".join(table_alerts)
        return Markup('<dev class="alerts-repr">' + str_rep + "</div>")

    def schema_change_formatter(self, context, model, schema):
        table_changes = []
        for el in model.schema_changes:
            event = el.result
            if event["value"]["operation"] == "table detected":
                continue

            created_at = formatted_time(el.created_at)
            table_changes.append(f'[{created_at}] {event["value"]}')

        str_rep = "<br/>".join(table_changes)
        return Markup('<dev class="schema-changes-repr">' + str_rep + "</div>")

    def alerts_number_formatter(self, context, model, shcema):
        url_for_details = url_for("table.details_view", id=model.id)
        return Markup(f'<a href="{url_for_details}">{model.alerts_number}</a>')

    def last_record_added_formatter(self, context, model, schema):
        metric = model.last_records_added
        if not metric:
            return None

        minutes = (metric.result["value"] / 60) % 60
        hours = metric.result["value"] // (60 * 60)
        hours_part = f"{hours} hours " if hours > 0 else ""
        minutes_part = f"{minutes:.2f} minutes"

        created_at = formatted_time(metric.created_at)

        return Markup(
            f'<dev class="last-record">[{created_at}] last record added {hours_part}{minutes_part} ago</div>'
        )

    column_searchable_list = ("source_db", "table_name", "namespace")

    column_editable_list = ["active", "time_column"]
    column_list = [
        "source_db",
        "active",
        "table_name",
        "time_column",
        "alerts_number",
        "grafana_url",
    ]
    column_details_list = [
        "source_db",
        "active",
        "table_name",
        "schema",
        "schema_changes",
        "alerts_by_creation",
        "last_records_added",
        "grafana_url",
    ]

    column_formatters = {
        "created_at": BaseRedataView._user_formatter_time,
        "schema": schema_formatter,
        "grafana_url": grafana_url_formatter,
        "alerts_by_creation": alerts_formatter,
        "alerts_number": alerts_number_formatter,
        "last_records_added": last_record_added_formatter,
        "schema_changes": schema_change_formatter,
    }
