import pdb
from sqlalchemy.sql import text
import json

from redata.db_operations import metrics_db, source_db


def setup_metrics():
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_delay (
        table_name text,
        value integer,
        created_at timestamp default now()
        );"""
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_table_schema_changes (
        table_name text,
        column_name text,
        column_type text,
        column_count integer,
        operation text,
        created_at timestamp default now()
        )"""
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_volume (
        table_name text,
        time_interval text,
        count bigint,
        created_at timestamp default now()
        );
        """
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_volume_diff (
        table_name text,
        from_time timestamp,
        count bigint,
        created_at timestamp default now()
        )"""
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_values (
        table_name text,
        column_name text,
        column_value text,
        check_name text,
        check_value double precision,
        time_interval text,
        created_at timestamp default now()
        )"""
    )

    print ("Generated tracked metrics for table")


if __name__ == "__main__":
    setup_metrics()