{{
    config(
        materialized='incremental'
    )
}}

select
    table_name,
    false as actively_monitored,
    (array_agg(time_filter) FILTER (WHERE time_filter IS NOT NULL))[1] as time_filter,
    {{current_timestamp()}} as detected_time
from
    {{ref('monitored_columns')}}

{% if is_incremental() %}
where
    table_name not in (
        select distinct table_name from {{this}} 
    )

{% endif %}

group by 
    table_name
