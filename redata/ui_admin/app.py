from flask import Flask
from flask_admin import Admin
from flask_sqlalchemy import SQLAlchemy
from flask_basicauth import BasicAuth
from flask_admin.contrib.sqla import ModelView
from redata.models.table import MonitoredTable

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

#class MonitoredTable (db.Model):
#    __tablename__ = 'monitored_table'
 #   id = db.Column('id',db.Integer, primary_key=True)
  #  created_at = db.Column('created_at',db.TIMESTAMP, default=datetime.datetime.utcnow)
   # source_db = db.Column('source_db',db.String, default=None)
    #active = db.Column('active',db.Boolean, default=True)
  #  table_name = db.Column('table_name',db.String)
  #  time_column = db.Column('time_column',db.String)
  #  time_column_type = db.Column('time_column_type',db.String)
  #  schema = db.Column('schema',db.JSON)

class MonitoredTableView(ModelView):

    def _user_formatter_time(view, context, model, name):
        if model.created_at:
            return model.created_at.strftime("%Y-%m-%d %H:%M:%S")
        else:
           return ""


    column_formatters = {
        'created_at' : _user_formatter_time
    }

    column_editable_list = ['active','time_column']
    column_exclude_list = ['schema']




admin = Admin(app, name='Redata', template_mode='bootstrap3')

admin.add_view(MonitoredTableView(MonitoredTable(db.Model), db.session))


app.run()