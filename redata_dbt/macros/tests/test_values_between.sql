{% macro test_values_between(model, column_name, full_table_name, low, high) %}

    select count(*)
    from {{ model }}
    where
        "table" = '{{ full_table_name}}' and
        {{ column_name }} is not null and
        (
            {{ column_name }} < {{ low }}  or 
            {{ column_name }} > {{ high }}  
        )

{% endmacro %}