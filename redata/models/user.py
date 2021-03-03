from redata.models.base import Base

from sqlalchemy import TIMESTAMP, Boolean, Column, Integer, String, JSON
from redata.db_operations import metrics_session
from werkzeug.security import generate_password_hash
import os

 
class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    first_name = Column(String(100))
    last_name = Column(String(100))
    login = Column(String(80), unique=True)
    email = Column(String(120))
    password = Column(String(128))

    # Flask-Login integration
    # NOTE: is_authenticated, is_active, and is_anonymous
    # are methods in Flask-Login < 0.3.0
    @property
    def is_authenticated(self):
        return True

    @property
    def is_active(self):
        return True

    @property
    def is_anonymous(self):
        return False

    def get_id(self):
        return self.id

    # Required for administrative interface
    def __unicode__(self):
        return self.username

    @classmethod
    def create_admin_user_if_not_exist(cls):

        assert os.environ.get('REDATA_ADMIN_USER'), 'please set env variable for admin user'
        assert os.environ.get('REDATA_ADMIN_PASSWORD'), 'please set env variable for admin password'

        is_admin = metrics_session.query(cls).filter(cls.login == os.environ.get('REDATA_ADMIN_USER')).count()
        if not is_admin:
            user = cls(login=os.environ.get('REDATA_ADMIN_USER'), password=generate_password_hash(os.environ.get('REDATA_ADMIN_PASSWORD')))
            metrics_session.add(user)
            metrics_session.commit()

            print ("Created admin user")
