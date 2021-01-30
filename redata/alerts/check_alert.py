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

            alert_on_z_score(filtered, table, 'count', checked_txt)


def delay_alert(db):
    tables = MonitoredTable.get_monitored_tables(db.name)

    for table in tables:

        sql_df = get_last_results(db, table, 'metrics_data_delay')

        checked_txt = f'delay since last data'
        alert_on_z_score(sql_df, table, 'value', checked_txt)