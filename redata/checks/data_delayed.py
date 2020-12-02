from redata.db_operations import metrics_db, source_db, metadata, get_age_function
from datetime import datetime

def check_data_delayed(table, time_column, time_type):

    age_fun = get_age_function()

    result = source_db.execute(f"""
        SELECT 
            {age_fun}(now(), max({time_column}))
        FROM {table}
    """).fetchall()[0]

    metrics_data_delay = metadata.tables['metrics_data_delay']
    stmt = metrics_data_delay.insert().values(
        table_name=table,
        value=result[0].seconds
    )
    metrics_db.execute(stmt)
