{{
    config(
        materialized='incremental'
    )
}}

select
    table_name,
    true as actively_monitored,
    (array_agg(time_filter) filter (where time_filter is not null))[1] as time_filter,
    {{current_timestamp()}} as detected_time
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
