from sqlalchemy import create_engine
from redata import settings
from sqlalchemy.orm import sessionmaker
from redata.backends.postgrsql import Postgres
from redata.backends.mysql import MySQL
from redata.backends.bigquery import BigQuery
from redata.backends.exasol import Exasol, ExasolEngine



def get_db_object(db_source):
    db_url = db_source['db_url']
    
    if db_url.startswith('exa+pyexasol'):
        return Exasol(db_source['name'], ExasolEngine(db_url))

    if db_url.startswith('bigquery'):
        BIG_QUERY_CREDS_PATH =  '/opt/creds/bigquery/creds.json'
        db = create_engine(db_url, credentials_path=BIG_QUERY_CREDS_PATH)
        return BigQuery(db_source['name'], db)
    
    db = create_engine(db_url)

    if db_url.startswith('postgres'):
        return Postgres(db_source['name'], db)

    if db_url.startswith('mysql'):
        return MySQL(db_source['name'], db)


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

def get_current_table_schema(db, table_name):
    return db.get_table_schema(table_name)
