from redata.models.checks import Check
from redata.db_operations import metrics_db, metrics_session

standard_checks = [
    {'func': 'data_schema.check_if_schema_changed', 'params': {}},
    {'func': 'data_delayed.check_data_delayed', 'params': {}},
    {'func': 'data_volume.check_data_volume', 'params': {'time_interval': '1 day'}},
]

def create_for_detected_table(table):

    for check in standard_checks:

        func = check['func']
        func_name = func.split('.')[-1],

        model_check = Check(
            table_id=table.id,
            name=func_name,
            columns=None,
            metrics=[func_name],
            query = {
                'type': 'standard',
                'path': f'redata.checks.{func}',
                'params': check['params']
            }
        )

        metrics_session.add(model_check)
