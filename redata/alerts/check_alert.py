import pandas as pd
from redata.db_operations import metrics_db

from redata.models.table import MonitoredTable
from redata.alerts.base import alert_on_z_score, get_last_results

from redata import settings


def volume_alert(db):
    tables = MonitoredTable.get_monitored_tables(db.name)

    for table in tables:

        sql_df = get_last_results(db, table, 'metrics_data_volume')
       
        for interval in settings.VOLUME_INTERVAL:
            filtered = sql_df[sql_df['time_interval'] == interval]    
            checked_txt = f'volume in interval: {interval}'

            alert_on_z_score(filtered, table, 'count', 'volume_alert', checked_txt)


def delay_alert(db):
    tables = MonitoredTable.get_monitored_tables(db.name)

    for table in tables:

        sql_df = get_last_results(db, table, 'metrics_data_delay')

        checked_txt = f'delay since last data'
        alert_on_z_score(sql_df, table, 'value', 'delay_alert', checked_txt)


def values_alert(db):
    tables = MonitoredTable.get_monitored_tables(db.name)

    for table in tables:

        sql_df = get_last_results(db, table, 'metrics_data_values')

        checks_df = sql_df[['check_name', 'time_interval', 'column_name']].drop_duplicates()

        for i, row in checks_df.iterrows():

            df = sql_df[
                (sql_df['check_name'] == row['check_name']) &
                (sql_df['time_interval'] == row['time_interval']) &
                (sql_df['column_name'] == row['column_name'])
            ]

            check_text = f'values for {row.check_name} in column: {row.column_name}, interval: {row.time_interval}'
            alert_on_z_score(df, table, 'check_value', row['check_name'], check_text)
    
