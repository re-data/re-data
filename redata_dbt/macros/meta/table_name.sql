{% macro table_name(table_schema, table_name) %}
    {{ adapter.dispatch('table_name')(table_schema, table_name) }}
{% endmacro %}


{% macro default__table_name(table_schema, table_name) %}
    '"' || table_schema || '"' || '.' || '"' || table_name || '"'
{% endmacro %}


{% macro bigquery__table_name(table_schema, table_name) %}
    '`' || table_schema || '`' || '.' || '`' || table_name || '`'
{% endmacro %}