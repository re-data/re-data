from redata.checks.data_schema import check_for_new_tables
from redata.db_operations import get_current_table_schema, metrics_db, source_db, metadata


def check_avg(table_name, checked_column, time_column, time_interval):

    result = source_db.execute(f"""
        SELECT
            AVG({checked_column})
        FROM
            {table_name}
        WHERE {time_column} > now() - INTERVAL '{time_interval}'
    """).first()

    return {
        'name': 'check_avg',
        'value': result.avg
    }


TYPE_CHECK_MAP = {
    'bigint': [check_avg],
    'integer': [check_avg]
}

def check_data_values(table_name, time_column, time_interval):

    schema = get_current_table_schema(table_name)

    metrics_data_values = metadata.tables['metrics_data_values']

    for col_dict in schema:
        col_name = col_dict['name']
        col_type = col_dict['type']

        for func in TYPE_CHECK_MAP.get(col_type, []):
            result = func(table_name, col_name, time_column, time_interval)

            stmt = metrics_data_values.insert().values(
                table_name=table_name,
                column_name=col_name,
                check_name=result['name'],
                check_value=result['value'],
                time_interval=time_interval
            )

            metrics_db.execute(stmt)