from redata.checks.data_schema import check_for_new_tables
from redata.db_operations import get_current_table_schema, metrics_db, metadata


def check_generic(func_name, db, table, checked_column, time_interval):
    sep = db.get_interval_sep()
    result = db.execute(f"""
        SELECT
            {func_name}({checked_column}) as value
        FROM
            {table.table_name}
        WHERE {table.time_column} > now() - INTERVAL {sep}{time_interval}{sep}
    """).first()

    metrics_data_values = metadata.tables['metrics_data_values']
    stmt = metrics_data_values.insert().values(
        table_id=table.id,
        column_name=checked_column,
        check_name=f'check_{func_name}',
        check_value=result.value,
        time_interval=time_interval
    )
    
    metrics_db.execute(stmt)


def check_avg(db, table, checked_column, time_interval):
    check_generic(
        'avg', db, table, checked_column, time_interval
    )

def check_min(db, table, checked_column, time_interval):
    check_generic(
        'min', db, table, checked_column, time_interval
    )

def check_max(db, table, checked_column, time_interval):
    check_generic(
        'max', db, table, checked_column, time_interval
    )

def check_count_nulls(db, table, checked_column, time_interval):
    
    sep = db.get_interval_sep()
    result = db.execute(f"""
        SELECT
            count(*) as value
        FROM
            {table.table_name}
        WHERE
            {table.time_column} > now() - INTERVAL {sep}{time_interval}{sep} and
            {checked_column} is null
    """).first()

    metrics_data_values = metadata.tables['metrics_data_values']
    stmt = metrics_data_values.insert().values(
        table_id=table.id,
        column_name=checked_column,
        check_name='check_count_nulls',
        check_value=result.value,
        time_interval=time_interval
    )
    
    metrics_db.execute(stmt)


def check_count_per_value(db, table, checked_column, time_interval):

    sep = db.get_interval_sep()
    check_distinct = db.execute(f"""
        SELECT
            count(distinct({checked_column})) as count
        FROM {table.table_name}
        WHERE
            {table.time_column} > now() - INTERVAL {sep}{time_interval}{sep}
    """).first()

    if check_distinct.count > 10:
        # Skipping if more than 10 different values showing up in column
        return

    result = db.execute(f"""
        SELECT
            count(*) as count,
            {checked_column} as value
        FROM
            {table.table_name}
        WHERE
            {table.time_column} > now() - INTERVAL {sep}{time_interval}{sep} and
            {checked_column} is not null
        GROUP BY
            {checked_column}
        ORDER BY
            count DESC
        LIMIT 10
    """)

    metrics_data_values = metadata.tables['metrics_data_values']
    for row in result:
        stmt = metrics_data_values.insert().values(
            table_id=table.id,
            column_name=checked_column,
            column_value=row.value,
            check_name='check_count_per_value',
            check_value=row.count,
            time_interval=time_interval
        )
    
        metrics_db.execute(stmt)