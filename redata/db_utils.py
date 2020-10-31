from sqlalchemy import create_engine

def get_source_connection():
    db_string = "postgres://postgres:mysecretpassword@192.168.99.100:5432/postgres"
    db = create_engine(db_string)
    return db


def get_current_table_schema(table_name):
    db = get_source_connection()
    
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

def get_monitored_tables():
    db = get_source_connection()

    result = db.execute("""
        SELECT
            table_name
        FROM
            metrics_table_metadata
    """)
    return list(el[0] for el in result)

