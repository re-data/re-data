import pdb
from redata.db_operations import metrics_db, metadata
from sqlalchemy.sql import text
from datetime import datetime, date, time 

def check_data_volume(db, table, time_interval):

    try:
        interval_part = db.make_interval(time_interval)
        result = db.check_data_volume(table, where_timecol=f"> now() - {interval_part}")
    except AttributeError:
        sep = db.get_interval_sep()
        result = db.execute(f"""
            SELECT
                count(*) as count
            FROM {table.table_name}
            WHERE {table.time_column} > now() - INTERVAL {sep}{time_interval}{sep}
            
        """).first()

    metrics_data_valume = metadata.tables['metrics_data_volume']

    stmt = metrics_data_valume.insert().values(
        table_id=table.id,
        time_interval=time_interval,
        count=result.count
    )
    
    metrics_db.execute(stmt)


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

    try:
        result = db.check_data_volume_diff(table, where_timecol=f">= '{from_time}'")
    except AttributeError:
        result = db.execute(f"""
            SELECT {table.time_column}::date as date, count(*) as count
            FROM {table.table_name}
            WHERE {table.time_column} >= :from_time
            GROUP BY {table.time_column}::date""", {'from_time': from_time}
        ).fetchall()

    metrics_data_volume = metadata.tables['metrics_data_volume_diff']

    for r in result:
        stmt = metrics_data_volume.insert().values(
            table_id=table.id,
            date=r.date,
            count=r.count
        )
        metrics_db.execute(stmt)
