from redata.checks.data_schema import check_for_new_tables
from redata.db_operations import get_current_table_schema, metrics_db, source_db, metadata


def check_generic(func_name, table_name, checked_column, time_column, time_interval):

    result = source_db.execute(f"""
        SELECT
            {func_name}({checked_column}) as value
        FROM
            {table_name}
        WHERE {time_column} > now() - INTERVAL '{time_interval}'
    """).first()

    metrics_data_values = metadata.tables['metrics_data_values']
    stmt = metrics_data_values.insert().values(
        table_name=table_name,
        column_name=checked_column,
        check_name=f'check_{func_name}',
        check_value=result.value,
        time_interval=time_interval
    )
    
    metrics_db.execute(stmt)


def check_avg(table_name, checked_column, time_column, time_interval):
    check_generic(
        'avg', table_name, checked_column, time_column, time_interval
    )

def check_min(table_name, checked_column, time_column, time_interval):
    check_generic(
        'min', table_name, checked_column, time_column, time_interval
    )

def check_max(table_name, checked_column, time_column, time_interval):
    check_generic(
        'max', table_name, checked_column, time_column, time_interval
    )

def check_count_nulls(table_name, checked_column, time_column, time_interval):
    
    result = source_db.execute(f"""
        SELECT
            count({checked_column}) as value
        FROM
            {table_name}
        WHERE
            {time_column} > now() - INTERVAL '{time_interval}' and
            {checked_column} is null
    """).first()

    metrics_data_values = metadata.tables['metrics_data_values']
    stmt = metrics_data_values.insert().values(
        table_name=table_name,
        column_name=checked_column,
        check_name='check_count_nulls',
        check_value=result.value,
        time_interval=time_interval
    )
    
    metrics_db.execute(stmt)


def check_count_per_value(table_name, checked_column, time_column, time_interval):

    check_distinct = source_db.execute(f"""
        SELECT
            count(distinct({checked_column})) as count
        FROM {table_name}
        WHERE
            {time_column} > now() - INTERVAL '{time_interval}'
    """).first()

    if check_distinct.count > 10:
        # Skipping if more than 10 different values showing up in column
        return

    result = source_db.execute(f"""
        SELECT
            count(*) as count,
            {checked_column} as value
        FROM
            {table_name}
        WHERE
            {time_column} > now() - INTERVAL '{time_interval}' and
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
            table_name=table_name,
            column_name=checked_column,
            column_value=row.value,
            check_name='check_count_per_value',
            check_value=row.count,
            time_interval=time_interval
        )
    
        metrics_db.execute(stmt)