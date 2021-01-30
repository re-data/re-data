import pandas as pd
from redata.db_operations import metrics_db
from scipy import stats
import math
from redata import settings
from redata.db_operations import metrics_session
from redata.models.alerts import Alert
from datetime import datetime, timedelta


def alert_on_z_score(df, table, check_col, alert_type, checked_txt):
    df = df[df[check_col].notnull()]

    last_el_zscore = stats.zscore(df[check_col])[-1]
    last_el = df[check_col].iloc[-1]
    

    if math.isnan(last_el_zscore):
        return

    if abs(last_el_zscore) > settings.ACCEPATBLE_Z_SCORE_DIFF:
        
        alert_desc = 'above' if last_el_zscore > 0 else 'below'

        print (f"Adding volume alert about table {table.table_name}")

        alert = Alert(
            text=f"""
                {checked_txt},
                {alert_desc} expected range, value: {last_el}, z_score: {last_el_zscore:.2f}
            """,
            severity=2,
            table_id=table.id,
            alert_type=alert_type
        )

        metrics_session.add(alert)
        metrics_session.commit()


def get_last_results(db, table, metrics_table, days=7):

    dt = datetime.utcnow() - timedelta(days=days)

    sql_df = pd.read_sql(
        f"""
            SELECT *
            FROM {metrics_table}
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

    return sql_df