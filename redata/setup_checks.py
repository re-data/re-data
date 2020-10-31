from sqlalchemy.sql import text
import json
from redata.db_utils import get_source_connection, get_current_table_schema

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
            VALUES (NOW(), :table_name, :column_name, :column_type, :schema)
        """), params)
        print ("Query added to initial monitoring")


def setup_metrics():
    db = get_source_connection()
    db.execute("""CREATE TABLE IF NOT EXISTS metrics_table_metadata (
        created_at timestamp default now(),
        table_name text,
        time_column text,
        time_column_type text,
        schema jsonb
        )"""
    )
    db.execute("""CREATE TABLE IF NOT EXISTS metrics_results (
        table_name text,
        created_at timestamp default now(),
        name text,
        value integer
        )"""
    )
    db.execute("""CREATE TABLE IF NOT EXISTS metrics_table_schema_changes (
        created_at timestamp default now(),
        table_name text,
        operation text,
        column_name text,
        column_type text,
        column_count integer
        )"""
    )
    db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_volume (
        created_at timestamp default now(),
        table_name text,
        time_interval text,
        count bigint
        )"""
    )

    print ("Generated tracked metrics for table")


setup_metrics()
