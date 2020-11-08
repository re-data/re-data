from datetime import datetime
from airflow import DAG
from airflow.operators.python_operator import PythonOperator

from redata.checks.data_delayed import check_data_delayed
from redata.checks.data_volume import check_data_volume, check_data_valume_diff
from redata.checks.data_schema import check_if_schema_changed, check_for_new_tables
from redata.db_operations import metrics_db


VOLUME_INTERVAL = ['1 hour', '1 day', '7 days', '30 days']

def run_checks():
    tables = metrics_db.execute("""
        SELECT *
        FROM metrics_table_metadata
    """)
    
    for table in tables:
        run_checks_for_table(table)


def run_checks_for_table(table):
    check_data_delayed(table.table_name, table.time_column, table.time_column_type)
    check_if_schema_changed(table.table_name)
    check_data_valume_diff(table.table_name, table.time_column)
    
    for interval in VOLUME_INTERVAL:
        check_data_volume(table.table_name, table.time_column, interval)


def run_check_for_new_tables():
    check_for_new_tables()


with DAG('validation_dag', description='Validate data',
          schedule_interval='*/10 * * * *',
          start_date=datetime(2017, 3, 20), catchup=False) as dag:

    run_checks_op = PythonOperator(
        task_id=f'run_checks',
        python_callable=run_checks,
        dag=dag
    )

    dag >> run_checks_op

    check_new_tables_op = PythonOperator(
        task_id='run_check_for_new_tables',
        python_callable=run_check_for_new_tables,
        dag=dag
    )

    dag >> check_new_tables_op
