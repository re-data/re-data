from redata.db_operations import metrics_db, metadata
from datetime import datetime

def check_data_delayed(db, table):
    try:
        result = db.check_data_delayed(table)
    except AttributeError:

        age_fun = db.get_age_function()
        result = db.execute(f"""
            SELECT 
                {age_fun}(now(), max({table.time_column}))
            FROM {table.table_name}
        """).fetchall()[0]

    metrics_data_delay = metadata.tables['metrics_data_delay']
    stmt = metrics_data_delay.insert().values(
        table_id=table.id,
        value=result[0].total_seconds()
    )
    metrics_db.execute(stmt)
