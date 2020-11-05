import json
import pdb
from sqlalchemy.sql import text
from redata.db_utils import get_source_connection, get_current_table_schema, get_monitored_tables
from redata.setup_checks import setup_initial_query
from redata.db_utils import DB

def check_data_is_coming(table, time_column, time_type):
    DB.execute(f"""
        INSERT INTO metrics_results (table_name, name, value)
        SELECT '{table}', '{time_column}_delay', EXTRACT (epoch from now() - max({time_column}))
        FROM {table}
    """)
    print (f"Successfull inserted for table {table}")


def update_to_current_schema(table, schema_cols):
    params = {
        'table_name': table,
        'schema': json.dumps({ 'columns': schema_cols })
    }
    DB.execute(text("""
        UPDATE metrics_table_metadata
        SET schema = :schema
        WHERE table_name = :table_name
    """), params)


def insert_schema_changed_record(table_name, operation, column_name, column_type, column_count):
    params = {
        'table_name': table_name,
        'operation': operation,
        'column_name': column_name,
        'column_type': column_type,
        'column_count': column_count
    }
    DB.execute(text("""
        INSERT INTO metrics_table_schema_changes 
        VALUES (
            NOw(), :table_name, :operation, :column_name, :column_type, :column_count
        )
    """), params)


def check_if_schema_changed(table):

    def schema_to_dict(schema):
        return dict([(el['name'], el['type'])for el in schema])

    get_last_schema = DB.execute(text("""
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
                insert_schema_changed_record(table, 'column removed', el, last_dict[el], len(current_dict))

        for el in current_dict:
            if el not in last_dict:
                print (f"{el} was added to schema")
                insert_schema_changed_record(table, 'column added', el, current_dict[el], len(current_dict))
            else:
                prev_type = last_dict[el]
                curr_type = current_dict[el]

                if curr_type != prev_type:
                    print (f"Type of column: {el} changed from {prev_type} to {curr_type}")
                    insert_schema_changed_record(table, 'column added', el, current_dict[el], len(current_dict))

        update_to_current_schema(table, current_schema)

def check_data_volume(table_name, time_column, time_interval):
    params = {
        'table_name': table_name,
        'time_column': time_column,
        'time_interval': time_interval
    }

    DB.execute(text(f"""
        INSERT INTO metrics_data_volume (table_name, time_interval, count)
        (
            SELECT :table_name, :time_interval, count(*)
            FROM {table_name}
            WHERE {time_column} > now() - INTERVAL :time_interval
        )
        """), params
    )
    print (f"Added to metrics data volume")


def check_data_valume_diff(table_name, time_column):
    from_time = DB.execute(text("""
        SELECT max(created_at) as created_at
        FROM metrics_data_volume_diff
        WHERE table_name = :table_name
        """), {'table_name': table_name}).first()

    from_time = from_time.created_at if from_time else None
    DB.execute(text(f"""
        INSERT INTO metrics_data_volume_diff (created_at, from_time, table_name, count)
        (
            SELECT NOW(), :from_time, :table_name, count(*)
            FROM {table_name}
            WHERE :from_time is null or {time_column} > :from_time
        )
        """), {'table_name': table_name, 'from_time': from_time}
    )


def check_for_new_tables():
    tables = DB.table_names()
    monitored_tables = set(get_monitored_tables())

    for table in tables:
        if table not in monitored_tables:
            insert_schema_changed_record(
                table, 'table created', None, None, None
            )
            setup_initial_query(table)


if __name__ == "__main__":
    check_data_volume('testing_grafana', 'created_at', '1 day')