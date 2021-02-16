from datetime import datetime
from airflow import DAG
from airflow.operators.python_operator import PythonOperator

from redata.checks.data_delayed import check_data_delayed
from redata.checks.data_volume import check_data_volume
from redata.db_operations import source_dbs
from redata.checks.data_schema import check_if_schema_changed, check_for_new_tables
from redata.checks.data_values import (
    check_avg,
    check_min,
    check_max,
    check_count_nulls,
    check_count_per_value
)

from redata.alerts import check_alert
from redata.db_operations import metrics_db
from redata.models.table import MonitoredTable
from redata import settings
from redata.conf import Conf
from redata.models.checks import Check
from redata.models.metrics import MetricFromCheck
from redata.db_operations import metrics_session
from redata.grafana.grafana_setup import create_dashboards

import importlib

def get_function(func_string):
    mod_name, func_name = func_string.rsplit('.', 1)
    mod = importlib.import_module(mod_name)
    func = getattr(mod, func_name)
    return func

def run_checks(db, conf):

    for namespace in db.namespaces:
        tables = MonitoredTable.get_monitored_tables_per_namespace(db.name, namespace)
        
        for table in tables:
            run_checks_for_table(db, table, conf)

def get_metrics(row, column):
    metrics = []
    for key, val in row.items():
        if key.startswith(column) or not column:
            metrics.append({
                'name': key.replace(column, '', 1),
                'value': val
            })
    return metrics


def run_checks_for_table(db, table, conf):

    checks = metrics_session.query(Check).filter(
        Check.table_id == table.id
    ).all()

    for check in checks:
        query = check.query
        if check.query['type'] == 'standard':
            func = get_function(check.query['path'])
            result = func(db=db, table=table, conf=conf, **check.query['params'])
        else:
            #TODO run raw query on DB
            result = None
        
        for row in result:
            columns = check.columns or ['']

            for c in columns:
                metrics = get_metrics(row, c)

                for m in metrics:

                    m = MetricFromCheck(
                        check_id=check.id,
                        table_id=table.id,
                        table_column=c if c else None,
                        params=check.query['params'],
                        metric=m['name'],
                        result={
                            'value': m['value']
                        },
                        created_at=conf.for_time
                    )
                    metrics_session.add(m)
    
    metrics_session.commit()

def run_check_for_new_tables(db, conf):
    check_for_new_tables(db, conf)

def run_compute_alerts(db, conf):

    for namespace in db.namespaces:
        tables = MonitoredTable.get_monitored_tables_per_namespace(db.name, namespace)
        
        for table in tables:
            run_compute_alerts_for_table(db, table, conf)


def run_compute_alerts_for_table(db, table, conf):
    print (f"Checking alerts for table:{table.table_name} [BEGIN]")
    check_alert.volume_alert(db, table, conf)
    check_alert.delay_alert(db, table, conf)
    check_alert.values_alert(db, table, conf)
    print (f"Checking alerts for table:{table.table_name} [DONE]")


def generate_grafana():
    print (f"Generating grafana dashboards: [BEGIN]")
    create_dashboards()
    print (f"Generating grafana dashboards: [DONE]")

with DAG('validation_dag', description='Validate data',
          schedule_interval=settings.REDATA_AIRFLOW_SCHEDULE_INTERVAL,
          start_date=datetime(2017, 3, 20), catchup=False) as dag:

    for source_db in source_dbs:
        run_checks_op = PythonOperator(
            task_id='run_checks_{}'.format(source_db.name),
            python_callable=run_checks,
            op_kwargs={'db': source_db, 'conf': Conf(datetime.utcnow())},
            dag=dag
        )

        check_new_tables_op = PythonOperator(
            task_id='run_check_for_new_tables_{}'.format(source_db.name),
            python_callable=run_check_for_new_tables,
            op_kwargs={'db': source_db, 'conf': Conf(datetime.utcnow())},
            dag=dag
        )

        compute_alerts_op = PythonOperator(
            task_id='compute_alerts_{}'.format(source_db.name),
            python_callable=run_compute_alerts,
            op_kwargs={'db': source_db, 'conf': Conf(datetime.utcnow())},
            dag=dag
        )

        generate_grafana = PythonOperator(
            task_id='generate_grafana_{}'.format(source_db.name),
            python_callable=generate_grafana,
            dag=dag
        )

        check_new_tables_op >> compute_alerts_op

