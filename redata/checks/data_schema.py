import json
import pdb
from redata.setup_checks import setup_initial_query
from sqlalchemy.sql import text
from redata.db_operations import DB, source_db, metadata, get_current_table_schema
from sqlalchemy import update


def get_monitored_tables():
    result = source_db.execute("""
        SELECT * FROM metrics_table_metadata
    """)
    return list(el.table_name for el in result)

def insert_schema_changed_record(table_name, operation, column_name, column_type, column_count):
    metrics_data_valume = metadata.tables['metrics_table_schema_changes']

    stmt = metrics_data_valume.insert().values(
        table_name=table_name,
        operation=operation,
        column_name=column_name,
        column_type=column_type,
        column_count=column_count
    )
    DB.execute(stmt)


def update_to_current_schema(table, schema_cols):
    metrics_table_metadata = metadata.tables['metrics_table_metadata']

    stmt = update(metrics_table_metadata).where(
        metrics_table_metadata.c.table_name == table
    ).values(schema={'columns': schema_cols})

    DB.execute(stmt)

def check_for_new_tables():
    tables = source_db.table_names()
    
    monitored_tables = set(get_monitored_tables())

    for table in tables:
        if table not in monitored_tables:
            insert_schema_changed_record(
                table, 'table created', None, None, None
            )
            setup_initial_query(table)


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
