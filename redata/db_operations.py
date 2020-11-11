from sqlalchemy import create_engine
from sqlalchemy.schema import MetaData
from redata import settings

def get_monitored_db_connection():
    db_string = settings.SOURCE_DB_URL
    db = create_engine(db_string)
    return db

def get_metrics_connection():
    db_string = settings.METRICS_DB_URL
    db = create_engine(db_string)
    return db

source_db = get_monitored_db_connection()
metrics_db = get_metrics_connection()

metadata = MetaData()
metadata.reflect(bind=metrics_db)

def get_current_table_schema(table_name):
    result = source_db.execute(f"""
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
