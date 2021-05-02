{% macro time_filter(column_name, column_type) %}

    case when {{ is_datetime(column_type)}} = true
    then
        column_name
    else
        null
    end

{% endmacro %}


{% macro time_window_start() %}

    {{ dbt_date.n_days_ago(var('redata:days_back') + 1) }}

{% endmacro %}


{% macro time_window_end() %}

    {{ dbt_date.n_days_ago(var('redata:days_back')) }}

{% endmacro %}


{% macro anamaly_detection_time_window_start() %}

    {{ dbt_date.n_days_ago(var('redata:days_back') + 30) }}

{% endmacro %}
