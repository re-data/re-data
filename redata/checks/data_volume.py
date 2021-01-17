import pdb
from redata.db_operations import metrics_session, metrics_db
from sqlalchemy.sql import text
from datetime import datetime, date, time 
from redata.models.metrics import MetricsDataVolume, MetricsDataVolumeDiff

def check_data_volume(db, table, time_interval):
    result = db.check_data_volume(table, time_interval)

    metric = MetricsDataVolume(
        table_id=table.id,
        time_interval=time_interval,
        count=result.count
    )

    metrics_session.add(metric)
    metrics_session.commit()


def check_data_volume_diff(db, table):
    from_time = metrics_db.execute(text("""
        SELECT max(created_at) as created_at
        FROM metrics_data_volume_diff
        WHERE table_id = :table_id
        """), {'table_id': table.id}).first()
    from_time = from_time.created_at if from_time else None

    if from_time is None:
        # if now previous diff computed, compute from start of day
        # mostly because we show that stat daily
        from_time = datetime.combine(date.today(), time())

    result = db.check_data_volume_diff(table, from_time=from_time)

    for r in (result or []):
        metric = MetricsDataVolumeDiff(
            table_id=table.id,
            date=r.date,
            count=r.count
        )
        metrics_session.add(metric)
    metrics_session.commit()
