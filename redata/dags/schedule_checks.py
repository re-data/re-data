from datetime import datetime
from airflow import DAG
from airflow.operators.python_operator import PythonOperator

from redata.checks.data_delayed import check_data_delayed
from redata.checks.data_volume import check_data_volume, check_data_valume_diff
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


VOLUME_INTERVAL = ['1 hour', '1 day', '7 days', '30 days']

def run_checks():

    tables = MonitoredTable.get_monitored_tables()
    
    for table in tables:
        run_checks_for_table(table)


def run_checks_for_table(table):
    check_data_delayed(table.table_name, table.time_column, table.time_column_type)
    print (f"Check data delayed table:{table.table_name} [DONE]")
    check_if_schema_changed(table.table_name)
    print (f"Check for schema changes table:{table.table_name} [DONE]")
    check_data_valume_diff(table.table_name, table.time_column)
    print (f"Check for data volume diff table:{table.table_name} [DONE]")
    
    for interval in VOLUME_INTERVAL:
        check_data_volume(table.table_name, table.time_column, interval)
    
    print (f"Check for data volume table:{table.table_name} [DONE]")

    for column in table.schema['columns']:
        for interval in VOLUME_INTERVAL:
            if column['type'] in ['bigint', 'integer', 'double precision']:
                check_min(table.table_name, column['name'], table.time_column, interval)
                check_max(table.table_name, column['name'], table.time_column, interval)
                check_avg(table.table_name, column['name'], table.time_column, interval)
                check_count_nulls(table.table_name, column['name'], table.time_column, interval)
    
        if column['type'] in ['text']:
            check_count_per_value(table.table_name, column['name'], table.time_column, '1 day')
            check_count_nulls(table.table_name, column['name'], table.time_column, '1 day')
    
    print (f"Check for data values table:{table.table_name} [DONE]")

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
