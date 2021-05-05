select
    "table",
    "column",
    "metric",
    avg(value) as last_avg,
    stddev(value) as last_stddev,
    max(time_window_end) as last_metric_time
from
    {{ ref('table_query') }}
where
    time_window_end > {{ anamaly_detection_time_window_start() }} and
    time_window_end <= {{ time_window_end() }}
group by
    "table", "column", "metric"