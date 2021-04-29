{% macro last_metric(full_table_name, column, metrics_table) %}

select value
from {{ metrics_table }}
order by created_at desc
limit 1

{% endmacro %}


{% macro last_stats(full_table_name, column, metrics_table) %}

select avg(value), stddev(value)
from {{ metrics_table }}
where created_at > {{ anamaly_detection_time_window_start() }}

{% endmacro %}