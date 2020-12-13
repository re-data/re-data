from sqlalchemy import create_engine
from sqlalchemy.schema import MetaData
from redata import settings
from sqlalchemy.orm import sessionmaker

def get_monitored_db_connection(db_string):
    db = create_engine(db_string)
    return db

def get_metrics_connection():
    db_string = settings.METRICS_DB_URL
    db = create_engine(db_string)
    return db


class DB(object):
    def __init__(self, name, db):
        self.name = name
        self.db = db

    def get_interval_sep(self):
        return "'" if self.db.name != 'mysql' else ""

    def get_age_function(self):
        return "age" if self.db.name != 'mysql' else "timediff"

    def execute(self, *args, **kwargs):
        return self.db.execute(*args, **kwargs)


source_dbs = [
    DB(source_db['name'], get_monitored_db_connection(source_db['db_url']))
    for source_db in settings.REDATA_SOURCE_DBS
]
metrics_db = get_metrics_connection()

metadata = MetaData()
metadata.reflect(bind=metrics_db)

MetricsSession = sessionmaker(bind=metrics_db)
metrics_session = MetricsSession()

def get_current_table_schema(db, table_name):
    result = db.execute(f"""
        SELECT 
            column_name, 
            data_type 
        FROM 
            information_schema.columns
        WHERE 
            table_name = '{table_name}';
    """)
    
    all_cols = list(result)
    schema_cols =  [ {'name': c_name, 'type': c_type} for c_name, c_type in all_cols]
    return schema_cols
