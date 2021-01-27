import pandas as pd
from scipy import stats
import numpy as np
import math

from redata.db_operations import metrics_db
from datetime import datetime, timedelta

from redata.models.table import MonitoredTable
from redata import settings
from redata.db_operations import metrics_session
from redata.models.alerts import Alert


def volume_alert(db):
    tables = MonitoredTable.get_monitored_tables(db.name)

    dt = datetime.utcnow() - timedelta(days=7)

    for table in tables:
        sql_df = pd.read_sql(
            f"""
                SELECT *
                FROM metrics_data_volume
                WHERE
                    created_at > '{dt}' and
                    table_id = {table.id}
                ORDER BY
                    created_at
            """,
            con=metrics_db,
            parse_dates=[
                'created_at',
            ]
        )

        check_for_alert(sql_df, table)


def check_for_alert(df, table):
    for interval in settings.VOLUME_INTERVAL:
        filtered = df[df['time_interval'] == interval]
        filtered = filtered[filtered['count'].notnull()]

        last_el_zscore = stats.zscore(filtered['count'])[-1]
        last_el = filtered['count'].iloc[-1]
        

        if math.isnan(last_el_zscore):
            continue

        if abs(last_el_zscore) > settings.ACCEPATBLE_Z_SCORE_DIFF:
            
            alert_desc = 'above' if last_el_zscore > 0 else 'below'

            print (f"Adding volume alert about table {table.table_name}")

            alert = Alert(
                text=f"""
                    {table.table_name}, interval: {interval},
                    has volume: {last_el} {alert_desc} expected range, z_score: {last_el_zscore:.2f}
                """,
                severity=10,
                table_id=table.id,
                alert_type=1
            )

            metrics_session.add(alert)
            metrics_session.commit()

