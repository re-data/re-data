import pdb
from redata.db_operations import DB, source_db, metadata
from sqlalchemy.sql import text

def check_data_volume(table_name, time_column, time_interval):

    result = source_db.execute(f"""
        SELECT 
            count(*)
        FROM {table_name}
        WHERE  {time_column} > now() - INTERVAL '{time_interval}'
        
    """).first()

    metrics_data_valume = metadata.tables['metrics_data_volume']

    stmt = metrics_data_valume.insert().values(
        table_name=table_name,
        time_interval=time_interval,
        count=result.count
    )
    
    DB.execute(stmt)

    print (f"Added to metrics data volume")


def check_data_valume_diff(table_name, time_column):
    from_time = DB.execute(text("""
        SELECT max(created_at) as created_at
        FROM metrics_data_volume_diff
        WHERE table_name = :table_name
        """), {'table_name': table_name}).first()
    from_time = from_time.created_at if from_time else None

    result = source_db.execute(text(f"""
        SELECT count(*)
        FROM {table_name}
        WHERE {time_column} > :from_time
    """), {'from_time': from_time}).first()

    metrics_data_valume = metadata.tables['metrics_data_volume_diff']

    stmt = metrics_data_valume.insert().values(
        table_name=table_name,
        from_time=from_time,
        count=result.count
    )
    
    DB.execute(stmt)