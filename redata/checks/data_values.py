from redata.checks.data_schema import check_for_new_tables
from redata.db_operations import metrics_db, metrics_session
from redata.models.metrics import MetricFromCheck


def check_column_values(db, table, check, time_interval, conf):

    result = db.check_column_values(table, check.metrics, time_interval, conf)
    return [result]
