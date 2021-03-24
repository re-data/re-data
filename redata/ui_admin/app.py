import flask_login as login
from flask import Blueprint, Flask, Markup, redirect, request, url_for
from flask_admin import Admin, AdminIndexView, expose, helpers
from werkzeug.security import generate_password_hash
from wtforms import fields, form

from redata import settings
from redata.db_operations import metrics_session
from redata.models import Alert, Check, DataSource, Scan, Table, User
from redata.ui_admin.alert import AlertView
from redata.ui_admin.check import ChecksTableView
from redata.ui_admin.data_source import DataSourceView
from redata.ui_admin.forms import LoginForm
from redata.ui_admin.scan import ScanView
from redata.ui_admin.table import TableView

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
    app.config["SESSION_COOKIE_NAME"] = "redata_seesion_cookie"

    app.route(admin_redirect, endpoint="/")
    app.register_blueprint(redata_blueprint)

    init_admin(app)
    return app


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


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=5001, debug=True)
