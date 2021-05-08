select
    stats.table_name,
    stats.column_name,
    stats.metric,
    (last_metric.last_value - stats.last_avg) / (stats.last_stddev + 0.0000000001) as z_score_value,
    last_metric.last_value as last_value,
    stats.last_avg as last_avg,
    stats.last_avg as last_stddev,
    {{ time_window_end() }} as time_window_end,
    {{current_timestamp()}} as computed_on
from
    {{ ref('all_last_stats') }} as stats,
    {{ ref('all_last_metrics') }} as last_metric
where
    stats.table_name = last_metric.table_name and
    stats.column_name = last_metric.column_name and
    stats.metric = last_metric.metric and
    last_metric.last_value is not null and
    stats.last_avg is not null and
    stats.last_stddev is not null