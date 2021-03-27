import flask_login as login
from flask import Blueprint, Flask, Markup, redirect, request, url_for

from redata.ui_admin.utils import (
    BaseRedataView,
    JSONField,
    grafana_url_formatter_fun,
    table_details_link_formatter,
)


class ChecksTableView(BaseRedataView):
    can_delete = False
    can_view_details = True

    column_searchable_list = ("name", "metrics")
    column_list = ["table", "name", "metrics", "created_at"]

    def table_details_formatter(self, context, model, name):
        return table_details_link_formatter(model.table)

    def is_accessible(self):
        return login.current_user.is_authenticated

    column_formatters = {
        "created_at": BaseRedataView._user_formatter_time,
        "table": table_details_formatter,
    }

    form_overrides = {
        "metrics": JSONField,
        "query": JSONField,
    }
