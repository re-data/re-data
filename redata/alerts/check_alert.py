import json

import pandas as pd

from redata import settings
from redata.alerts.base import alert_on_z_score, get_last_results
from redata.db_operations import metrics_db, metrics_session
from redata.metric import Metric
from redata.models import Alert
from redata.models.table import Table
from redata.utils import name_for


def alert(db, check, conf):
    if check.name == Metric.SCHEMA_CHANGE:
        alert_for_schema_change(db, check, conf)
    else:

        metrics = check.metrics
        for column, metrics_for_col in metrics.items():
            for metric in metrics_for_col:
                sql_df = get_last_results(db, check, column, metric, conf)
                sql_df["result"] = pd.to_numeric(sql_df["result"])

                if column == Metric.TABLE_METRIC:
                    alert = metric
                else:
                    alert = name_for(column, metric)

                checked_txt = alert

                alert_on_z_score(sql_df, check, alert, checked_txt, conf)


def alert_for_schema_change(db, check, conf):

    df = get_last_results(
        db, check, Metric.TABLE_METRIC, Metric.SCHEMA_CHANGE, conf, days=1
    )
    for index, row in df.iterrows():

        changes = json.loads(row[0])
        if changes["operation"] == "table detected":
            continue

        alert = Alert(
            text=f"""
                schema change detected - {changes['operation']}: {changes['column_name']}, type: {changes['column_type']}
            """,
            severity=2,
            table_id=check.table_id,
            alert_type=check.name,
            created_at=conf.for_time,
        )

        metrics_session.add(alert)
        metrics_session.commit()
