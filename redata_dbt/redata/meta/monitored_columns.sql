

select
    CONCAT (table_schema, '.', table_name) as full_table_name,
    column_name,
    data_type,
    is_nullable,
    {{ is_datetime('data_type') }} as is_datetime,
    {{ time_filter('column_name', 'data_type') }} as time_filter
from
    information_schema.columns  
where
    table_schema = 'javascript'

