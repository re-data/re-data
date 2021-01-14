from datetime import datetime
from airflow import DAG
from airflow.operators.python_operator import PythonOperator

from redata.checks.data_delayed import check_data_delayed
from redata.checks.data_volume import check_data_volume, check_data_volume_diff
from redata.db_operations import source_dbs
from redata.checks.data_schema import check_if_schema_changed, check_for_new_tables
from redata.checks.data_values import (
    check_avg,
    check_min,
    check_max,
    check_count_nulls,
    check_count_per_value
)

from redata.db_operations import metrics_db
from redata.models.table import MonitoredTable
from redata import settings


def run_checks(db):

    tables = MonitoredTable.get_monitored_tables(db.name)
    
    for table in tables:
        run_checks_for_table(db, table)


def run_checks_for_table(db, table):
    print (f"Running checks for table:{table.table_name} [BEGIN]")
    check_data_delayed(db, table)
    print (f"Check data delayed table:{table.table_name} [DONE]")
    check_if_schema_changed(db, table)
    print (f"Check for schema changes table:{table.table_name} [DONE]")
    check_data_volume_diff(db, table)
    print (f"Check for data volume diff table:{table.table_name} [DONE]")
    
    for interval in settings.VOLUME_INTERVAL:
        check_data_volume(db, table, interval)
    
    print (f"Check for data volume table:{table.table_name} [DONE]")

    for column in table.schema['columns']:
        for interval in settings.VOLUME_INTERVAL:
            if db.is_numeric(column['type']):
                check_min(db, table, column['name'], interval)
                check_max(db, table, column['name'], interval)
                check_avg(db, table, column['name'], interval)
                check_count_nulls(db, table, column['name'], interval)
    
        if db.is_character(column['type']):
            check_count_per_value(db, table, column['name'], '1 day')
            check_count_nulls(db, table, column['name'], '1 day')
    
    print (f"Check for data values table:{table.table_name} [DONE]")
    print (f"Running checks for table:{table.table_name} [DONE]")

def run_check_for_new_tables(db):
    check_for_new_tables(db)


with DAG('validation_dag', description='Validate data',
          schedule_interval=settings.REDATA_AIRFLOW_SCHEDULE_INTERVAL,
          start_date=datetime(2017, 3, 20), catchup=False) as dag:

    for source_db in source_dbs:
        run_checks_op = PythonOperator(
            task_id='run_checks_{}'.format(source_db.name),
            python_callable=run_checks,
            op_kwargs={'db': source_db},
            dag=dag
        )

        check_new_tables_op = PythonOperator(
            task_id='run_check_for_new_tables_{}'.format(source_db.name),
            python_callable=run_check_for_new_tables,
            op_kwargs={'db': source_db},
            dag=dag
        )
