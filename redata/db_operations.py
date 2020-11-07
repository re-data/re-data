from sqlalchemy import create_engine
from sqlalchemy.schema import MetaData

def get_monitored_db_connection():
    db_string = "postgres://postgres:mysecretpassword@192.168.99.100:5432/postgres"
    db = create_engine(db_string, echo=True)
    return db

def get_metrics_connection():
    db_string = "postgres://postgres:mysecretpassword@192.168.99.100:5432/postgres"
    db = create_engine(db_string, echo=True)
    return db

source_db = get_monitored_db_connection()
DB = get_metrics_connection()

metadata = MetaData()
metadata.reflect(bind=DB)

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
