{{
    config(
        materialized='incremental'
    )
}}

select
    full_table_name,
    false as actively_monitored,
    {{current_timestamp()}} as detected_time,
    (array_agg(time_filter) FILTER (WHERE time_filter IS NOT NULL))[1] as time_filter
from
    {{ref('monitored_columns')}}

{% if is_incremental() %}
where
    full_table_name not in (
        select distinct full_table_name from {{this}} 
    )

{% endif %}

group by 
    full_table_name
