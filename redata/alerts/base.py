import pandas as pd
from redata.db_operations import metrics_db
from scipy import stats
import math
from redata import settings
from redata.db_operations import metrics_session
from redata.models.alerts import Alert
from datetime import datetime, timedelta


def alert_on_z_score(df, check, alert_type, checked_txt, conf):
    df = df[df['result'].notnull()]

    if len(df) <= 1:
        return

    last_el_zscore = stats.zscore(df['result'])[-1]
    last_el = df['result'].iloc[-1]
    

    if math.isnan(last_el_zscore):
        return

    if abs(last_el_zscore) > settings.ACCEPTABLE_Z_SCORE_DIFF:
        
        alert_desc = 'above' if last_el_zscore > 0 else 'below'

        alert = Alert(
            text=f"""
                {checked_txt},
                {alert_desc} expected range, value: {last_el}, z_score: {last_el_zscore:.2f}
            """,
            severity=2,
            table_id=check.table_id,
            alert_type=alert_type,
            created_at=conf.for_time
        )

        metrics_session.add(alert)
        metrics_session.commit()


def get_last_results(db, check, conf, days=21):

    for_time = conf.for_time
    dt = for_time - timedelta(days=days)
    

    sql_df = pd.read_sql(
        f"""
            SELECT (result ->> 'value') as result
            FROM metric
            WHERE
                created_at > '{dt}' and
                created_at < '{for_time}' and
                check_id = {check.id}
            ORDER BY
                created_at
        """,
        con=metrics_db,
        parse_dates=[
            'created_at',
        ]
    )

    return sql_df