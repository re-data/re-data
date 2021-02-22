from flask import Flask
from flask_admin import Admin
from flask_admin import AdminIndexView
from flask import redirect, url_for
import flask_login as login
from flask_admin import helpers, expose
from flask import request
from werkzeug.security import generate_password_hash
from flask_admin.contrib.sqla import ModelView

from redata.models import MonitoredTable, Check, User
from redata import settings
from redata.db_operations import metrics_session
from redata.ui_admin.forms import LoginForm


app = Flask(__name__)

# set optional bootswatch theme
app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
app.config['SQLALCHEMY_DATABASE_URI'] = settings.METRICS_DB_URL
app.config['SECRET_KEY'] = settings.FLASK_UI_SECRET_KEY

# Initialize flask-login
def init_login():
    login_manager = login.LoginManager()
    login_manager.init_app(app)

    # Create user loader function
    @login_manager.user_loader
    def load_user(user_id):
        return metrics_session.query(User).get(user_id)


@app.route('/')
def admin_redirect():
    return redirect('/admin')



# Create customized index view class that handles login & registration
class RedataAdminView(AdminIndexView):

    @expose('/')
    def index(self):
        if not login.current_user.is_authenticated:
            return redirect(url_for('.login_view'))
        return super(RedataAdminView, self).index()

    @expose('/login/', methods=('GET', 'POST'))
    def login_view(self):
        # handle user login
        form = LoginForm(request.form)
        if helpers.validate_form_on_submit(form):
            user = form.get_user()
            login.login_user(user)

        if login.current_user.is_authenticated:
            return redirect(url_for('.index'))
        self._template_args['form'] = form
        return super(RedataAdminView, self).index()

    @expose('/logout/')
    def logout_view(self):
        login.logout_user()
        return redirect(url_for('.index'))



class MonitoredTableView(ModelView):
    can_delete = False

    def is_accessible(self):
        return login.current_user.is_authenticated

    def _user_formatter_time(self, context, model, name):
        if model.created_at:
            return model.created_at.strftime("%Y-%m-%d %H:%M:%S")
        else:
           return ""


    column_formatters = {
        'created_at' : _user_formatter_time
    }

    column_editable_list = ['active','time_column']
    column_exclude_list = ['schema']



class ChecksTableView(ModelView):
    can_delete = False
    page_size = 1000

    def is_accessible(self):
        return login.current_user.is_authenticated


init_login()

admin = Admin(app, name='Redata', index_view=RedataAdminView(), template_mode='bootstrap3', base_template='redata_master.html')


admin.add_view(MonitoredTableView(MonitoredTable, metrics_session))
admin.add_view(ChecksTableView(Check, metrics_session))


if __name__ == "__main__":

    app.run(host='0.0.0.0', debug=True)