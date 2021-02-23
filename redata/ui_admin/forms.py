from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import LoginManager
from wtforms import form, fields, validators
from redata.db_operations import metrics_session
from redata.models import User


# Define login and registration forms (for flask-login)
class LoginForm(form.Form):
    login = fields.StringField(validators=[validators.required()], render_kw={"placeholder": "Username", 'class': 'form-element'})
    password = fields.PasswordField(validators=[validators.required()], render_kw={"placeholder": "Password", 'class': 'form-element'})

    def validate_login(self, field):
        user = self.get_user()

        if user is None:
            raise validators.ValidationError('Invalid user')

        if not check_password_hash(user.password, self.password.data):
            raise validators.ValidationError('Invalid password')

    def get_user(self):
        return metrics_session.query(User).filter_by(login=self.login.data).first()