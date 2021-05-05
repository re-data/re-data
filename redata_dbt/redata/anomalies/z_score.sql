select
    stats."table",
    stats."column",
    stats."metric",
    (last_metric.last_value - stats.last_avg) / (stats.last_stddev + 0.0000000001) as z_score
from
    {{ ref('all_last_stats') }} as stats,
    {{ ref('all_last_metrics') }} as last_metric
where
    stats.table = last_metric.table and
    stats.column = last_metric.column and
    stats.metric = last_metric.metric and
    last_metric.last_value is not null and
    stats.last_avg is not null and
    stats.last_stddev is not null