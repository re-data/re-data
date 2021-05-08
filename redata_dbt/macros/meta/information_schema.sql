{% macro tables_in_schema(for_schema) %}
    {{ adapter.dispatch('tables_in_schema')(for_schema) }}
{% endmacro %}

{% macro default__tables_in_schema(for_schema) %}
    INFORMATION_SCHEMA.columns
    where
    table_schema = '{{ for_schema }}'
{% endmacro %}

{% macro bigquery__tables_in_schema(for_schema) %}
    `{{for_schema}}` . `INFORMATION_SCHEMA`.`COLUMNS`
{% endmacro %}