{% macro get_tables() %}
    select table_name, time_filter from {{ ref('monitored_tables') }}
{% endmacro %}
