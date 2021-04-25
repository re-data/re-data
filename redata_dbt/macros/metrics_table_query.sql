{% macro metrics_table_query(mtable) %}

    {% set columns_query %}
        select * from {{ ref('monitored_columns') }}
        where full_table_name = '{{ mtable['full_table_name'] }}'
    {% endset %}

    {% set columns = run_query(columns_query) %}
    
    {% for col in columns %}
        {{ metrics_for_column(mtable, col) }}
    {% endfor %}

    {{  metrics_for_whole_table(mtable) }}

{% endmacro %}


{% macro metrics_for_column(mtable, column) %}

{% set column_metrics_yml -%}
numeric:
    - min
    - max
    - avg
    - count_nulls
text:
    - min_length
    - max_length
    - avg_length
    - count_nulls
    - count_missing
{%- endset %}

    {% set column_metrics = fromyaml(column_metrics_yml) %}

    {% set data_kind = get_column_type(column) %}

    {% for func in column_metrics[data_kind] %}
        {{ column_expression(column['column_name'], func) }} as "{{column['column_name']}}::{{func}}",
    {% endfor %}

{% endmacro %}


{% macro metrics_for_whole_table(mtable, column) %}
    count(*) as "::row_count"
{% endmacro %}