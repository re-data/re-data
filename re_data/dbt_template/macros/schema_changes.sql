

{% macro schema_change_add_orders_column() %}
    {% set alter_table %}
        alter table {{ ref('orders')}} add column completed boolean
    {% endset %}
    {% do run_query(alter_table) %}
{% endmacro %}


{% macro schema_change_drop_orders_column() %}
    {% set alter_table %}
        alter table {{ ref('orders')}} drop column completed
    {% endset %}
    {% do run_query(alter_table) %}
{% endmacro %}