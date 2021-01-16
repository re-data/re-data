from redata.db_operations import metrics_session
from redata.models.metrics import MetricsDataDelay
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

    if result[0]:
        metric = MetricsDataDelay(
            table_id=table.id,
            value=result[0].total_seconds()
        )

        metrics_session.add(metric)
        metrics_session.commit()
