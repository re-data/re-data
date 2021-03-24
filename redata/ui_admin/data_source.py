from datetime import datetime

import flask_login as login
from flask import Blueprint, Flask, Markup, redirect, request, url_for

from redata.checks.data_schema import check_for_new_tables
from redata.conf import Conf
from redata.grafana.grafana_setup import create_dashboards
from redata.models import DataSource
from redata.ui_admin.utils import (
    BaseRedataView,
    grafana_url_formatter_fun,
    table_details_link_formatter,
)


class DataSourceView(BaseRedataView):
    can_delete = True
    can_create = True

    column_searchable_list = ("name",)

    column_exclude_list = "password"

    form_widget_args = {
        "password": {"type": "password"},
    }

    form_choices = {"source_type": DataSource.SUPPORTED_SOURCES}

    def after_model_change(self, form, model, is_created):

        # Discover tables and added data source
        conf = Conf(datetime.utcnow())
        db = model.get_db_object()
        check_for_new_tables(db, conf)
        create_dashboards()

    def is_accessible(self):
        return login.current_user.is_authenticated
