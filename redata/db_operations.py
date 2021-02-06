from sqlalchemy import create_engine
from redata import settings
from sqlalchemy.orm import sessionmaker
from redata.backends.postgrsql import Postgres
from redata.backends.mysql import MySQL
from redata.backends.bigquery import BigQuery
from redata.backends.exasol import Exasol, ExasolEngine
from redata import settings



def get_db_object(db_source):
    db_url = db_source['db_url']
    
    if db_url.startswith('exa+pyexasol'):
        return Exasol(db_source['name'], ExasolEngine(db_url), schema=db_source['schema'])

    if db_url.startswith('bigquery'):
        db = create_engine(db_url, credentials_path=settings.REDATA_BIGQUERY_DOCKER_CREDS_FILE_PATH)
        return BigQuery(db_source['name'], db, schema=db_source['schema'])
    
    db = create_engine(db_url)

    if db_url.startswith('postgres'):
        return Postgres(db_source['name'], db, schema=db_source['schema'])

    if db_url.startswith('mysql'):
        return MySQL(db_source['name'], db, schema=db_source['schema'])


    raise Exception('Not supported DB')

def get_db_by_name(name):
    for source_db in settings.REDATA_SOURCE_DBS:
        if source_db['name'] == name:
            return get_db_object(source_db)

def get_metrics_connection():
    db_string = settings.METRICS_DB_URL
    db = create_engine(db_string)
    return db

source_dbs = [
    get_db_object(source_db)
    for source_db in settings.REDATA_SOURCE_DBS
]

metrics_db = get_metrics_connection()

MetricsSession = sessionmaker(bind=metrics_db)
metrics_session = MetricsSession()
