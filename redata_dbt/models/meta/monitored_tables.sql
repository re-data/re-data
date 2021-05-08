{{
    config(
        materialized='incremental'
    )
}}

with new_tables as (
    select
        table_name
    from
        {{ref('monitored_columns')}}
    {%- if is_incremental() %}
    where
        table_name not in (
            select distinct table_name from {{this}} 
        )
    {%- endif %}
    group by 
        table_name
),

new_time_columns as (
    select 
        new_tables.table_name,
        columns.time_filter
    from
        new_tables,
        {{ref('monitored_columns')}} as columns
    where
        columns.table_name = new_tables.table_name and
        columns.time_filter is not null
    )

select
    table_name,
    true as actively_monitored,
    (array_agg(time_filter)){{first_array_el()}} as time_filter,
    (array_agg(time_filter)) as possible_time_columns,
    {{current_timestamp()}} as detected_time
from
    new_time_columns
group by table_name
