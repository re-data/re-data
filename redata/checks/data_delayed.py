from redata.db_operations import metrics_session
from redata.models.metrics import MetricsDataDelay
from datetime import datetime

def check_data_delayed(db, table, conf):
    result = db.check_data_delayed(table, conf)

    results = []
    if result[0]:
        results.append({
            'check_data_delayed': result[0].total_seconds()
        })

    return results
