import json
from datetime import datetime

from flask import Blueprint, Flask, Markup, url_for
from flask_admin.contrib.sqla import ModelView
from flask_admin.contrib.sqla.view import ModelView
from flask_admin.form import fields
from flask_admin.model import typefmt
from jinja2 import Markup

from redata import settings


def grafana_url_formatter_fun(table):
    if table.grafana_url:
        url = f"<a href='http://{settings.GRAFNA_URL}{table.grafana_url}' target='_blank'>dashboard</a>"
        return Markup(url)
    else:
        return "Not yet created"


def table_details_link_formatter(table):
    url_for_details = url_for("table.details_view", id=table.id)
    return Markup(f'<a href="{url_for_details}">{table.full_table_name}</a>')


def json_formatter(view, value):
    json_value = json.dumps(value, ensure_ascii=False, indent=2)
    return Markup('<pre class="json">{}</pre>'.format(json_value))


def time_formatter(view, value):
    return formatted_time(value)


def formatted_time(time):
    if time:
        return time.strftime("%Y-%m-%d %H:%M:%S")
    else:
        return ""


class JSONField(fields.JSONField):
    def _value(self):
        if self.raw_data:
            return self.raw_data[0]
        elif self.data:
            return json.dumps(self.data, ensure_ascii=False, indent=2)
        else:
            return ""


REDATA_FORMATTERS = typefmt.BASE_FORMATTERS.copy()
REDATA_FORMATTERS[dict] = json_formatter
REDATA_FORMATTERS[datetime] = time_formatter


class BaseRedataView(ModelView):
    page_size = 1000
    column_type_formatters = REDATA_FORMATTERS
    column_default_sort = ("created_at", True)

    def _user_formatter_time(self, context, model, name):
        return formatted_time(model.created_at)

    column_formatters = {"created_at": _user_formatter_time}
