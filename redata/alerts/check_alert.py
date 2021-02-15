import pandas as pd
from redata.db_operations import metrics_db

from redata.models.table import MonitoredTable
from redata.alerts.base import alert_on_z_score, get_last_results

from redata import settings



def volume_alert(db, table, conf):

    sql_df = get_last_results(db, table, 'metrics_data_volume', conf)

    filtered = sql_df[sql_df['time_interval'] == settings.INTERVAL_FOR_ALERTS]    
    checked_txt = f'volume in interval: {settings.INTERVAL_FOR_ALERTS}'

    alert_on_z_score(filtered, table, 'count', 'volume_alert', checked_txt, conf)


def delay_alert(db, table, conf):

    sql_df = get_last_results(db, table, 'metrics_data_delay', conf)

    checked_txt = f'delay since last data'
    alert_on_z_score(sql_df, table, 'value', 'delay_alert', checked_txt, conf)


def values_alert(db, table, conf):

    sql_df = get_last_results(db, table, 'metrics_data_values', conf)

    sql_df = sql_df[sql_df['time_interval'] == settings.INTERVAL_FOR_ALERTS]

    checks_df = sql_df[['check_name', 'column_name', 'column_value']].drop_duplicates()

    for i, row in checks_df.iterrows():

        df = sql_df[
            (sql_df['check_name'] == row['check_name']) &
            (sql_df['column_name'] == row['column_name'])
        ]

        if row['column_value']:
            df = df[df['column_value'] == row['column_value']]

        check_text = f'column: {row.column_name}, values for {row.check_name}'
        alert_on_z_score(df, table, 'check_value', row['check_name'], check_text, conf)
    
