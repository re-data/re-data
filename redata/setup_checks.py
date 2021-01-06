from sqlalchemy.sql import text
import json

from redata.db_operations import metrics_db


def setup_metrics():
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_delay (
        table_id integer,
        value integer,
        created_at timestamp default now()
        );

        CREATE INDEX IF NOT EXISTS metrics_data_delay_idx on metrics_data_delay (table_id, created_at);
        CREATE INDEX IF NOT EXISTS metrics_data_delay_created_idx on metrics_data_delay (created_at);
        """
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_table_schema_changes (
        table_id integer,
        column_name text,
        column_type text,
        column_count integer,
        operation text,
        created_at timestamp default now()
        );

        CREATE INDEX IF NOT EXISTS metrics_table_schema_changes_idx on metrics_table_schema_changes (table_id, created_at);
        CREATE INDEX IF NOT EXISTS metrics_table_schema_changes_created_idx on metrics_table_schema_changes (created_at);
        """
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_volume (
        table_id integer,
        time_interval text,
        count bigint,
        created_at timestamp default now()
        );

        CREATE INDEX IF NOT EXISTS metrics_data_volume_idx on metrics_data_volume (table_id, created_at);
        CREATE INDEX IF NOT EXISTS metrics_data_volume_created_idx on metrics_data_volume (created_at);
        """
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_volume_diff (
        table_id integer,
        date date,
        count bigint,
        created_at timestamp default now()
        );
        
        CREATE INDEX IF NOT EXISTS metrics_data_volume_diff_idx on metrics_data_volume_diff (table_id, created_at);
        CREATE INDEX IF NOT EXISTS metrics_data_volume_diff_created_idx on metrics_data_volume_diff (created_at);
        """
    )
    metrics_db.execute("""CREATE TABLE IF NOT EXISTS metrics_data_values (
        table_id integer,
        column_name text,
        column_value text,
        check_name text,
        check_value double precision,
        time_interval text,
        created_at timestamp default now()
        );

        CREATE INDEX IF NOT EXISTS metrics_data_values_idx on metrics_data_values (table_id, created_at);
        CREATE INDEX IF NOT EXISTS metrics_data_values_created_idx on metrics_data_values (created_at);
        """
    )