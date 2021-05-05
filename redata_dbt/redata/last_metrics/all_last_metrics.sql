select
    "table",
    "column",
    "metric",
    value as last_value
from 
    {{ ref('table_query')}}
where
    time_window_end = {{ time_window_end() }}