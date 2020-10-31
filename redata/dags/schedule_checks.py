from datetime import datetime
from airflow import DAG
from airflow.operators.python_operator import PythonOperator

from redata.db_utils import get_source_connection, get_current_table_schema
from redata import checks


VOLUME_INTERVAL = ['1 hour', '1 day', '7 days', '30 days']


def run_checks_for_table(table, time_column, time_type):
    checks.check_data_is_coming(table, time_column, time_type)
    checks.check_if_schema_changed(table)
    
    for interval in VOLUME_INTERVAL:
        checks.check_data_volume(table, time_column, interval)

def run_check_for_new_tables():
    checks.check_for_new_tables()

with DAG('validation_dag', description='Validate data',
          schedule_interval='*/1 * * * *',
          start_date=datetime(2017, 3, 20), catchup=False) as dag:

    db = get_source_connection()

    tables = db.execute("""
        SELECT table_name, time_column, time_column_type
        FROM metrics_table_metadata
    """)
    
    for table, time_column, time_type in tables:
        run_checks = PythonOperator(
            task_id=f'run_checks_for_{table}',
            python_callable=run_checks_for_table,
            op_kwargs={'table': table, 'time_column': time_column, 'time_type': time_type},
            dag=dag
        )

        dag >> run_checks

    check_new_tables = PythonOperator(
        task_id='run_check_for_new_tables',
        python_callable=run_check_for_new_tables,
        dag=dag
    )

    dag >> check_new_tables
