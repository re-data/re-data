from redata.db_operations import metrics_db, source_db, metadata
from datetime import datetime

def check_data_delayed(table, time_column, time_type):
    result = source_db.execute(f"""
        SELECT 
            now(), max({time_column})
        FROM {table}
    """).fetchall()[0]

    now, time = result[0], result[1]

    metrics_data_delay = metadata.tables['metrics_data_delay']

    stmt = metrics_data_delay.insert().values(
        table_name=table,
        value=(now - time).seconds
    )
    metrics_db.execute(stmt)
