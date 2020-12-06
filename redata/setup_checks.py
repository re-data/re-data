from sqlalchemy.sql import text
import json

from redata.db_operations import metrics_db


def setup_metrics():
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_delay (
        table_id integer,
        value integer,
        created_at timestamp default now()
        );"""
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_table_schema_changes (
        table_id integer,
        column_name text,
        column_type text,
        column_count integer,
        operation text,
        created_at timestamp default now()
        )"""
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_volume (
        table_id integer,
        time_interval text,
        count bigint,
        created_at timestamp default now()
        );
        """
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_volume_diff (
        table_id integer,
        from_time timestamp,
        count bigint,
        created_at timestamp default now()
        )"""
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_values (
        table_id integer,
        column_name text,
        column_value text,
        check_name text,
        check_value double precision,
        time_interval text,
        created_at timestamp default now()
        )"""
    )