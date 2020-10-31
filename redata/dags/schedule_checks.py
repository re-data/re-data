from datetime import datetime
from airflow import DAG
from airflow.operators.python_operator import PythonOperator

from redata.db_utils import get_source_connection, get_current_table_schema
from redata import checks


VOLUME_INTERVAL = ['1 hour', '1 day', '7 days', '30 days']

with DAG('validation_dag', description='Validate data',
          schedule_interval='*/1 * * * *',
          start_date=datetime(2017, 3, 20), catchup=False) as dag:

    db = get_source_connection()

    tables = db.execute("""
        SELECT table_name, time_column, time_column_type
        FROM metrics_table_metadata
    """)
    
    for table, time_column, time_type in tables:
        coming = PythonOperator(
            task_id=f'check_data_is_coming_{table}',
            python_callable=checks.check_data_is_coming,
            op_kwargs={'table': table, 'time_column': time_column, 'time_type': time_type},
            dag=dag
        )
        dag >> coming

        schema_change = PythonOperator(
            task_id=f'check_if_schema_changed_{table}',
            python_callable=checks.check_if_schema_changed,
            op_kwargs={'table': table},
            dag=dag
        )
        dag >> schema_change

        for interval in VOLUME_INTERVAL:
            slug_inteval = interval.replace(" ", "_")
            volume = PythonOperator(
                task_id=f'check_data_volume_{table}_interval_{slug_inteval}',
                python_callable=checks.check_data_volume,
                op_kwargs={'table_name': table, 'time_column': time_column, 'time_interval': interval},
                dag=dag
            )
            dag >> volume
