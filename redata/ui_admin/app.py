from flask import Flask, Markup
from flask_admin import Admin, BaseView, expose
from flask_sqlalchemy import SQLAlchemy
from flask_basicauth import BasicAuth
import datetime
from flask_admin.contrib.sqla import ModelView

app = Flask(__name__)

# set optional bootswatch theme
app.config['FLASK_ADMIN_SWATCH'] = 'cerulean'
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgres://redata:mysecretpassword@localhost:5434/redata'
app.config['SECRET_KEY'] = 'mysecretkey'

app.config['BASIC_AUTH_USERNAME'] = 'admin'
app.config['BASIC_AUTH_PASSWORD'] = 'admin'
app.config['BASIC_AUTH_FORCE'] = True

basic_auth = BasicAuth(app)


db = SQLAlchemy(app)

class MonitoredTable (db.Model):
    __tablename__ = 'monitored_table'
    id = db.Column('id',db.Integer, primary_key=True)
    created_at = db.Column('created_at',db.TIMESTAMP, default=datetime.datetime.utcnow)
    source_db = db.Column('source_db',db.String, default=None)
    active = db.Column('active',db.Boolean, default=True)
    table_name = db.Column('table_name',db.String)
    time_column = db.Column('time_column',db.String)
    time_column_type = db.Column('time_column_type',db.String)
    schema = db.Column('schema',db.JSON)

class MyView(ModelView):

    def _user_formatter(view, context, model, name):
        if model.time_column:
            markupstring = '<select name="cars" id="cars">'
            for el in model.schema['columns']:
                if el['type'] == "timestamp without time zone":
                    markupstring += f'<option value="volvo">{el["name"]}</option>'
            markupstring += '</select>'
            return Markup(markupstring)
        else:
           return ""

    def _user_formatter_time(view, context, model, name):
        if model.created_at:
            return model.created_at - datetime.timedelta(microseconds=model.created_at.microsecond)
        else:
           return ""


    column_formatters = {
        'time_column': _user_formatter,
        'created_at' : _user_formatter_time
    }

    column_editable_list = ['active']




admin = Admin(app, name='Redata', template_mode='bootstrap3')
# Add administrative views here

admin.add_view(MyView(MonitoredTable, db.session))

app.debug = True

app.run()