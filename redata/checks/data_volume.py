from redata.db_operations import metrics_session, metrics_db
from sqlalchemy.sql import text
from datetime import datetime, date, time 
from redata.models.metrics import MetricsDataVolume, MetricsDataVolumeDiff

def check_data_volume(db, table, time_interval, conf):
    result = db.check_data_volume(table, time_interval, conf)

    metric = MetricsDataVolume(
        table_id=table.id,
        time_interval=time_interval,
        count=result.count,
        created_at=conf.for_time
    )

    metrics_session.add(metric)
    metrics_session.commit()


def check_data_volume_diff(db, table, conf):
    from_time = metrics_db.execute(text("""
        SELECT max(created_at) as created_at
        FROM metrics_data_volume_diff
        WHERE
            table_id = :table_id and
            created_at < :for_time
        """), {'table_id': table.id, 'for_time': conf.for_time}).first()
    from_time = from_time.created_at if from_time else None

    if from_time is None:
        # if now previous diff computed, compute from start of day
        # mostly because we show that stat daily
        from_time = datetime.combine(conf.for_time.date(), time())

    result = db.check_data_volume_diff(table, from_time=from_time, conf=conf)

    for r in (result or []):
        metric = MetricsDataVolumeDiff(
            table_id=table.id,
            date=r.date,
            count=r.count,
            created_at=conf.for_time
        )
        metrics_session.add(metric)
    metrics_session.commit()
