from sqlalchemy.sql import text
import json
from redata.db_utils import get_current_table_schema
from redata.db_utils import DB

def setup_initial_query(db_table_name):

    print (f"running setup for {db_table_name}")

    preference = ['timestamp without time zone', 'timestamp with time zone', 'date']
    
    best_column = None
    best_type = None
    closest_date = None

    schema_cols = get_current_table_schema(db_table_name)

    for pref in preference:
        columns = [col['name'] for col in schema_cols if col['type'] == pref]
        observed = []

        for c in columns:
            counts = DB.execute(text(f"""
                SELECT
                    max(:c)
                FROM
                    {db_table_name}
                WHERE
                    {c} < NOW()
            """), {'c': c})

            result = counts.fetchall()
            if not closest_date or (result and result[0][0] > closest_date):
                best_column = c
                best_type = pref
                closest_date = result or result[0][0]

    if best_column:
        params = {
            'table_name': db_table_name,
            'column_name': best_column,
            'column_type': best_type,
            'schema': json.dumps({ 'columns': schema_cols })
        }
        DB.execute(text("""
            INSERT INTO metrics_table_metadata
            VALUES (NOW(), :table_name, :column_name, :column_type, :schema)
        """), params)
        print ("Query added to initial monitoring")


def setup_metrics():
    DB.execute("""CREATE TABLE IF NOT EXISTS metrics_table_metadata (
        created_at timestamp default now(),
        table_name text,
        time_column text,
        time_column_type text,
        schema jsonb
        )"""
    )
    DB.execute("""CREATE TABLE IF NOT EXISTS metrics_results (
        table_name text,
        created_at timestamp default now(),
        name text,
        value integer
        )"""
    )
    DB.execute("""CREATE TABLE IF NOT EXISTS metrics_table_schema_changes (
        created_at timestamp default now(),
        table_name text,
        operation text,
        column_name text,
        column_type text,
        column_count integer
        )"""
    )
    DB.execute("""CREATE TABLE IF NOT EXISTS metrics_data_volume (
        created_at timestamp default now(),
        table_name text,
        time_interval text,
        count bigint
        )"""
    )

    print ("Generated tracked metrics for table")


