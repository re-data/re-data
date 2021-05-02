-- depends_on: {{ ref('row_count') }}
-- depends_on: {{ ref('avg_length') }}
-- depends_on: {{ ref('avg') }}
-- depends_on: {{ ref('count_missing') }}
-- depends_on: {{ ref('count_nulls') }}
-- depends_on: {{ ref('max_length') }}
-- depends_on: {{ ref('max') }}
-- depends_on: {{ ref('min') }}
-- depends_on: {{ ref('min_length') }}

{% set for_metric = [] %}

{% set tracked_metrics = ['row_count', 'avg_length', 'avg', 'count_missing', 'count_nulls', 'max_length', 'min', 'max', 'min_length'] %}
{% set tracked_metrics = ['row_count', 'avg_length', 'avg'] %}

{% for metric in tracked_metrics %}
    {%- call statement('combinations', fetch_result=True) -%}
        select distinct "table", "column" from {{ ref(metric) }}
    {%- endcall -%}

    {%- set result = load_result('combinations')['data'] -%}
    {% do for_metric.append({'computed_for': result, 'metric': metric}) %}

{% endfor %}


{% for result in for_metric %}

    {% set table_col_list = result.computed_for %}
    {% set metric = result.metric %}

    {% for mtable, mcolumn in table_col_list %}

        {% set last_metric = run_query(last_metric(mtable, mcolumn, metric))[0].dict() %}

        {% set last_metric_value = last_metric.last_value %}
        {% set last_metric_time_window_end = last_metric.time_window_end %}
        {% set stats_dict = run_query(last_stats(mtable, mcolumn, metric))[0].dict() %}
        {% set stat_sttdev = stats_dict.stddev %}
        {% set stat_avg = stats_dict.avg %}

        {% if stat_sttdev == 0 %}
            {% set z_score = 1000000 %}
        {% endif %}

        {% if (stat_sttdev != None) and (stat_avg != None) and (stat_sttdev != 0) %}
            {% set z_score = ((last_metric_value - stat_avg) / stat_sttdev) %}
        {% else %}
            {% set z_score = None %}
        {% endif %}

        (
        select
            {{z_score|replace(None, 'null')}} as z_score,
            {{last_metric_value|replace(None, 'null')}} as last_metric_value,
            {{stat_avg|replace(None, 'null')}} as curr_avg,
            {{stat_sttdev|replace(None, 'null')}} as curr_sttdev,
            '{{mtable}}' as "table",
            '{{mcolumn}}' as "column",
            {{ time_window_end() }} as time_window_end
        )
    
        {% if not loop.last -%} union all {%- endif %}
    {% endfor %}

    {% if not loop.last -%} union all {%- endif %}
{% endfor %}