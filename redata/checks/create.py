from redata.models.checks import Check
from redata.db_operations import metrics_db, metrics_session
from redata.models.metrics import Metric
import json
from sqlalchemy import ARRAY

table_checks = [
    {
        'metric': Metric.DELAY,
        'func': 'data_delayed.check_data_delayed',
        'params': {}
    },
    {
        'metric': Metric.SCHEMA_CHANGE,
        'func': 'data_schema.check_if_schema_changed',
        'params': {}
    },
    {
        'metric': Metric.COUNT,
        'func': 'data_volume.check_data_volume',
        'params': {'time_interval': '1 day'}
    }
]


def create_for_detected_table(table):

    for check in table_checks:

        func = check['func']
        metric_dict = {Metric.TABEL_METRIC: [check['metric']]}

        model_check = Check(
            table_id=table.id,
            name=check['metric'],
            metrics=metric_dict,
            query = {
                'type': 'standard',
                'path': f'redata.checks.{func}',
                'params': check['params']
            }
        )

        metrics_session.add(model_check)
    metrics_session.commit()