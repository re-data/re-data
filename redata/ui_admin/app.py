from flask import Flask
from flask_admin import Admin

from flask import redirect, url_for
from flask_admin.contrib.sqla import ModelView
from redata.models.table import MonitoredTable
from redata import settings
from redata.db_operations import metrics_session

app = Flask(__name__)

# set optional bootswatch theme
app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
app.config['SQLALCHEMY_DATABASE_URI'] = settings.METRICS_DB_URL
app.config['SECRET_KEY'] = settings.FLASK_UI_SECRET_KEY

class MonitoredTableView(ModelView):

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

@app.route('/')
def admin_redirect():
    return redirect('/admin')


admin = Admin(app, name='Redata', template_mode='bootstrap3')

admin.add_view(MonitoredTableView(MonitoredTable, metrics_session))


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)