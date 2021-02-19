from redata.db_operations import metrics_session
from datetime import datetime
from redata.models import Metric

def check_data_delayed(db, table, conf):
    result = db.check_data_delayed(table, conf)

    results = []
    if result[0]:
        results.append({
            Metric.DELAY: result[0].total_seconds()
        })

    return results
