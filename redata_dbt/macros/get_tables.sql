{% macro get_tables() %}
    select full_table_name, time_filter from {{ ref('monitored_tables') }}
{% endmacro %}
