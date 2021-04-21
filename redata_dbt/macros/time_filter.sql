{% macro time_filter(column_name, column_type) %}

    case when {{ is_datetime(column_type)}} = true
    then
        column_name
    else
        null
    end

{% endmacro %}
