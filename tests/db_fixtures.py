# STL imports
import os

# Third parties imports
import pytest
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import pdb

# Custom imports

# pdb.set_trace()

# POSTGRES_USER = os.environ['REDATA_METRICS_DATABASE_USER']
# POSTGRES_PWD = os.environ['REDATA_METRICS_DATABASE_PASSWORD']
# POSTGRES_HOST = os.environ['REDATA_METRICS_DATABASE_HOST']
# POSTGRES_PORT = os.environ['REDATA_METRICS_DATABASE_PORT']
# POSTGRES_DB_NAME = os.environ['REDATA_METRICS_DATABASE_NAME']


# @pytest.fixture(scope='function')
# def db_session(postgresql):
#     """Session for SQLAlchemy."""
#     from pyramid_fullauth.models import Base  # pylint:disable=import-outside-toplevel

#     # NOTE: this fstring assumes that psycopg2 >= 2.8 is used. Not sure about it's support in psycopg2cffi (PyPy)
#     connection = f'postgresql+psycopg2://{POSTGRES_USER}:{POSTGRES_PWD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB_NAME}'

#     engine = create_engine(connection, echo=False, poolclass=NullPool)

#     pyramid_basemodel.Session = scoped_session(
#         sessionmaker(extension=ZopeTransactionExtension()))

#     pyramid_basemodel.bind_engine(
#         engine, pyramid_basemodel.Session, should_create=True, should_drop=True)

#     yield pyramid_basemodel.Session

#     transaction.commit()
#     Base.metadata.drop_all(engine)
