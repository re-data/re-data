from redata.db_operations import metrics_session
from redata.models.metrics import MetricsDataDelay
from datetime import datetime

def check_data_delayed(db, table):
    result = db.check_data_delayed(table)

    if result[0]:
        metric = MetricsDataDelay(
            table_id=table.id,
            value=result[0].total_seconds()
        )

        metrics_session.add(metric)
        metrics_session.commit()
