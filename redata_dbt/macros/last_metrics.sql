{%- macro last_metric(full_table_name, column, metrics_table) -%}
    select
        value as last_value
    from
        {{ ref(metrics_table) }}
    where
        {% if column != None %} "column" = '{{column}}' {% else %} "column" = '' {% endif %} and
        "table" = '{{full_table_name}}' and
        time_window_end <= {{ time_window_end() }}
    order by
        time_window_end desc
    limit 1
{%- endmacro -%}


{%- macro last_stats(full_table_name, column, metrics_table) -%}
    select
        avg(value) as avg,
        stddev(value) as stddev
    from
        {{ ref(metrics_table) }}
    where
        time_window_end > {{ anamaly_detection_time_window_start() }} and
        time_window_end <= {{ time_window_end() }} and
        {% if column %} "column" = '{{column}}' {% else %} "column" = '' {% endif %} and
        "table" = '{{full_table_name}}'
{%- endmacro -%}