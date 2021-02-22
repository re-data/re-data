from redata.models.checks import Check
from redata.db_operations import metrics_db, metrics_session
from redata.metric import Metric
from redata import settings
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


def create_for_detected_table(db, table):

    for check in table_checks:

        func = check['func']
        metric_dict = {Metric.TABLE_METRIC: [check['metric']]}

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

    create_column_checks(db, table)


def create_column_checks(db, table):

    metrics = {}
    
    for col in table.schema['columns']:
        if col['name'] in settings.SKIP_COLUMNS:
            continue
        if col['type'] not in db.numeric_types() + db.character_types():
            continue

        checks_for_col = []
        if col['type'] in db.numeric_types():
            checks_for_col = [el for el in Metric.FOR_NUMERICAL_COL]
        elif col['type'] in db.character_types():
            checks_for_col = [el for el in Metric.FOR_TEXT_COL]
        
        metrics[col['name']] = checks_for_col

    check = Check(
        table_id=table.id,
        name='column_values',
        metrics=metrics,
        query={
            'type': 'standard',
            'path': f'redata.checks.data_values.check_column_values',
            'params': {'time_interval': '1 day'}
        }
    )

    metrics_session.add(check)
    metrics_session.commit()