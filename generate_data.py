from typing import ValuesView
from sqlalchemy import create_engine
from sqlalchemy.sql import text
import json
from time import sleep

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

def setup_initial_query(db_table_name):

    db = get_source_connection()
    print (f"running setup for {db_table_name}")

    preference = ['timestamp without time zone', 'timestamp with time zone', 'date']
    
    best_column = None
    best_type = None

    schema_cols = get_current_table_schema(db_table_name)

    for pref in preference:
        columns = [col['name'] for col in schema_cols if col['type'] == pref]
        observed = []

        for c in columns:
            counts = db.execute(f"""
                SELECT
                    count(*)
                FROM
                    {db_table_name}
                WHERE
                    {c} > now() - interval '1 days'
            """)

            if counts.fetchall()[0][0] > 0:
                observed.append(c)
        
        if observed:

            # For now take first column to be observed one

            best_column = observed[0]
            best_type = pref

    
    if best_column:
        params = {
            'table_name': db_table_name,
            'column_name': best_column,
            'column_type': best_type,
            'schema': json.dumps({ 'columns': schema_cols })
        }
        db.execute(text("""
            INSERT INTO metrics_table_metadata
            VALUES (:table_name, :column_name, :column_type, :schema)
        """), params)
        print ("Query added to initial monitoring")


def setup_query_for_all_tables():
    db = get_source_connection()

    tables = db.table_names()
    for table in tables:
        setup_initial_query(table)


def setup_metrics():
    db = get_source_connection()
    db.execute("""
        CREATE TABLE IF NOT EXISTS metrics_table_metadata (
            table_name text,
            time_column text,
            time_column_type text,
            schema jsonb
        )
        """
    )
    db.execute("CREATE TABLE IF NOT EXISTS metrics_results (table_name text, created_at timestamp default now(), name text, value integer)")
    print ("Generated tracked metrics for table")


def check_data_coming_validator(db, table, time_column, time_type):
    db.execute(f"""
        INSERT INTO metrics_results (table_name, name, value)
        SELECT '{table}', '{time_column}_delay', EXTRACT (epoch from now() - max({time_column})) / 60
        FROM {table}
    """)
    print (f"Successfull inserted for table {table}")


def update_to_current_schema(db, table, schema_cols):
    params = {
        'table_name': table,
        'schema': json.dumps({ 'columns': schema_cols })
    }
    db.execute(text("""
        UPDATE metrics_table_metadata
        SET schema = :schema
        WHERE table_name = :table_name
    """), params)

def check_for_schema_change(db, table):
    def schema_to_dict(schema):
        return dict([(el['name'], el['type'])for el in schema])

    get_last_schema = db.execute(text("""
        SELECT schema FROM metrics_table_metadata WHERE table_name = :table
    """), {'table': table})

    last_schema = get_last_schema.first()[0]['columns']
    current_schema = get_current_table_schema(table)


    if last_schema != current_schema:
        last_dict = schema_to_dict(last_schema)
        current_dict = schema_to_dict(current_schema)

        for el in last_dict:
            if el not in current_dict:
                print (f"{el} was removed from schema")

        for el in current_dict:
            if el not in last_dict:
                print (f"{el} was added to schema")
            else:
                prev_type = last_dict[el]
                curr_type = current_dict[el]

                if curr_type != prev_type:
                    print (f"Type of column: {el} changed from {prev_type} to {curr_type}")

        update_to_current_schema(db, table, current_schema)


def run_validator():
    db = get_source_connection()
    tables = db.execute("""
        SELECT table_name, time_column, time_column_type
        FROM metrics_table_metadata
    """)
    for table, time_column, time_type in tables:

        check_data_coming_validator(db, table, time_column, time_type)
        
        check_for_schema_change(db, table)


def main():

    while True:
        run_validator()
        sleep(5)

# setup_query_for_all_tables()
# setup_metrics()
main()

