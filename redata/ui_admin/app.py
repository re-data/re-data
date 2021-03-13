from datetime import datetime

import flask_login as login
from flask import Blueprint, Flask, Markup, redirect, request, url_for
from flask_admin import Admin, AdminIndexView, expose, helpers
from flask_admin.contrib.sqla import ModelView
from werkzeug.security import generate_password_hash

from redata import settings
from redata.checks.data_schema import check_for_new_tables
from redata.conf import Conf
from redata.db_operations import metrics_session
from redata.grafana.grafana_setup import create_dashboards
from redata.models import Alert, Check, DataSource, Scan, Table, User
from redata.ui_admin.forms import LoginForm

redata_blueprint = Blueprint("route_blueprint", __name__)

# Initialize flask-login
def init_login(app):
    login_manager = login.LoginManager()
    login_manager.init_app(app)

    @app.teardown_request
    def teardown_request(*args, **kwargs):
        "Expire and remove the session after each request"
        metrics_session.expire_all()

    # Create user loader function
    @login_manager.user_loader
    def load_user(user_id):
        return metrics_session.query(User).get(user_id)


def init_admin(app):
    init_login(app)
    admin = Admin(
        app,
        name="Redata",
        index_view=RedataAdminView(),
        template_mode="bootstrap3",
        base_template="redata_master.html",
    )
    admin.add_view(AlertView(Alert, metrics_session))
    admin.add_view(TableView(Table, metrics_session))
    admin.add_view(ChecksTableView(Check, metrics_session))
    admin.add_view(DataSourceView(DataSource, metrics_session))
    admin.add_view(ScanView(Scan, metrics_session))


def create_app():

    app = Flask(__name__)

    # set optional bootswatch theme
    app.config["FLASK_ADMIN_SWATCH"] = "cerulean"
    app.config["SQLALCHEMY_DATABASE_URI"] = settings.METRICS_DB_URL
    app.config["SECRET_KEY"] = settings.FLASK_UI_SECRET_KEY

    app.route(admin_redirect, endpoint="/")
    app.register_blueprint(redata_blueprint)

    init_admin(app)
    return app


def get_grafana_url(table):
    if table.grafana_url:
        url = f"<a href='http://{settings.GRAFNA_URL}{table.grafana_url}' target='_blank'>{table.full_table_name}</a>"
        return Markup(url)
    else:
        return table.full_table_name


@redata_blueprint.route("/")
def admin_redirect():
    return redirect("/admin")


class RedataAdminView(AdminIndexView):
    def is_visible(self):
        # This view won't appear in the menu structure
        return False

    @expose("/")
    def index(self):
        if not login.current_user.is_authenticated:
            return redirect(url_for(".login_view"))
        return super(RedataAdminView, self).index()

    @expose("/login/", methods=("GET", "POST"))
    def login_view(self):
        # handle user login
        form = LoginForm(request.form)
        if helpers.validate_form_on_submit(form):
            user = form.get_user()
            login.login_user(user)

        if login.current_user.is_authenticated:
            return redirect(url_for(".index"))
        self._template_args["form"] = form
        return super(RedataAdminView, self).index()

    @expose("/logout/")
    def logout_view(self):
        login.logout_user()
        return redirect(url_for(".index"))


class BaseRedataView(ModelView):
    page_size = 1000

    def _user_formatter_time(self, context, model, name):
        if model.created_at:
            return model.created_at.strftime("%Y-%m-%d %H:%M:%S")
        else:
            return ""

    column_formatters = {"created_at": _user_formatter_time}


class TableView(BaseRedataView):
    can_delete = False
    can_view_details = True

    def is_accessible(self):
        return login.current_user.is_authenticated

    def grafana_url_formatter(self, context, model, name):
        return get_grafana_url(model)

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
            table_alerts.append(f"[{alert.created_at}] {alert.text}")

        str_rep = "<br/>".join(table_alerts)
        return Markup('<dev class="alerts-repr">' + str_rep + "</div>")

    def schema_change_formatter(self, context, model, schema):
        table_changes = []
        for el in model.schema_changes:
            event = el.result
            if event["value"]["operation"] == "table detected":
                continue

            table_changes.append(f'[{el.created_at}] {event["value"]}')

        str_rep = "<br/>".join(table_changes)
        return Markup('<dev class="schema-changes-repr">' + str_rep + "</div>")

    def alerts_number_formatter(self, context, model, shcema):
        url_for_details = url_for("table.details_view", id=model.id)
        return Markup(f'<a href="{url_for_details}">{model.alerts_number}</a>')

    def last_record_added_formatter(self, context, model, schema):
        metric = model.last_records_added
        if not metric:
            return None

        minutes = metric.result["value"] / 60
        return Markup(
            f'<dev class="last-record">[{metric.created_at}], last_record_added - {minutes:.2f} minutes ago</div>'
        )

    column_searchable_list = ("source_db", "table_name", "namespace")

    column_editable_list = ["active", "time_column"]
    column_exclude_list = ["schema", "created_at"]
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


class AlertView(BaseRedataView):
    can_delete = True
    can_create = False

    column_searchable_list = ("text", "alert_type")

    def table_grafana_url_formatter(self, context, model, name):
        return get_grafana_url(model.table)

    def is_accessible(self):
        return login.current_user.is_authenticated

    column_formatters = {
        "created_at": BaseRedataView._user_formatter_time,
        "table": table_grafana_url_formatter,
    }


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


class ChecksTableView(BaseRedataView):
    can_delete = False

    column_searchable_list = ("name", "metrics", "query")

    def table_grafana_url_formatter(self, context, model, name):
        return get_grafana_url(model.table)

    def is_accessible(self):
        return login.current_user.is_authenticated

    column_formatters = {
        "created_at": BaseRedataView._user_formatter_time,
        "table": table_grafana_url_formatter,
    }


class ScanView(BaseRedataView):
    can_delete = False
    form_excluded_columns = ("created_at", "status", "run_type")

    def is_accessible(self):
        return login.current_user.is_authenticated


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5001, debug=True)
