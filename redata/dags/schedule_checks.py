from datetime import datetime
from airflow import DAG
from airflow.operators.python_operator import PythonOperator

from redata.checks.data_delayed import check_data_delayed
from redata.checks.data_volume import check_data_volume
from redata.models import DataSource
from redata.checks.data_schema import check_if_schema_changed, check_for_new_tables

from redata.alerts import check_alert
from redata.db_operations import metrics_db
from redata.models.table import MonitoredTable
from redata import settings
from redata.conf import Conf
from redata.models.checks import Check
from redata.models.metrics import MetricFromCheck
from redata.db_operations import metrics_session
from redata.grafana.grafana_setup import create_dashboards
from redata.models import Run

import importlib


def get_function(func_string):
    mod_name, func_name = func_string.rsplit(".", 1)
    mod = importlib.import_module(mod_name)
    func = getattr(mod, func_name)
    return func


def run_checks(db, conf):

    for namespace in db.namespaces:
        tables = MonitoredTable.get_monitored_tables_per_namespace(db.name, namespace)

        for table in tables:
            run_checks_for_table(db, table, conf)


def run_checks_for_table(db, table, conf):

    checks = metrics_session.query(Check).filter(Check.table_id == table.id).all()

    for check in checks:
        query = check.query
        if check.query["type"] == "standard":
            func = get_function(check.query["path"])
            result = func(
                db=db, table=table, check=check, conf=conf, **check.query["params"]
            )
        else:
            # TODO run raw query on DB
            result = None

        MetricFromCheck.add_metrics(result, check, conf)


def run_check_for_new_tables(db, conf):
    check_for_new_tables(db, conf)


def run_compute_alerts(db, conf):

    for namespace in db.namespaces:
        tables = MonitoredTable.get_monitored_tables_per_namespace(db.name, namespace)

        for table in tables:
            run_compute_alerts_for_table(db, table, conf)


def run_compute_alerts_for_table(db, table, conf):
    print(f"Checking alerts for table:{table.table_name} [BEGIN]")
    for check in table.checks:
        check_alert.alert(db, check, conf)

    print(f"Checking alerts for table:{table.table_name} [DONE]")


def generate_grafana():
    print(f"Generating grafana dashboards: [BEGIN]")
    create_dashboards()
    print(f"Generating grafana dashboards: [DONE]")


def process_run():

    run = Run.get_not_started_run()
    if run is not None:
        run.status = "pending"
        metrics_session.commit()

        conf = Conf(run.for_date)

        for source_db in DataSource.source_dbs():
            run_check_for_new_tables(source_db, conf)
            run_checks(source_db, conf)
            run_compute_alerts(source_db, conf)

        generate_grafana()

        run.status = "success"
        metrics_session.commit()


with DAG(
    "validation_dag",
    description="Validate data",
    schedule_interval="*/1 * * * *",
    start_date=datetime(2017, 3, 20),
    catchup=False,
    is_paused_upon_creation=False,
) as dag_run:

    PythonOperator(task_id="process_run", python_callable=process_run, dag=dag_run)


def add_run():
    run = Run(for_date=datetime.utcnow(), status="not started", run_type="scheduled")

    metrics_session.add(run)
    metrics_session.commit()


with DAG(
    "generate_run",
    description="Generate runs for automatic checks",
    schedule_interval=settings.REDATA_AIRFLOW_SCHEDULE_INTERVAL,
    start_date=datetime(2017, 3, 20),
    catchup=False,
    is_paused_upon_creation=False,
) as dag_generate:

    PythonOperator(task_id="add_run", python_callable=add_run, dag=dag_generate)
