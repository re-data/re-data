from flask import Flask
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




admin = Admin(app, name='Redata', template_mode='bootstrap3')
# Add administrative views here

admin.add_view(ModelView(MonitoredTable, db.session))



app.run()