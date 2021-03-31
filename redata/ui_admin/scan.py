import flask_login as login
from flask import Blueprint, Flask, Markup, redirect, request, url_for

from redata.ui_admin.utils import (
    BaseRedataView,
    grafana_url_formatter_fun,
    table_details_link_formatter,
)


class ScanView(BaseRedataView):
    can_delete = False
    form_excluded_columns = ("created_at", "status", "run_type")

    def is_accessible(self):
        return login.current_user.is_authenticated
