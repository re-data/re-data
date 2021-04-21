{% macro is_datetime(column) %}
    case when {{column}} in (
            'timestamp without time zone',
            'timestamp with time zone',
            'date'
    )
        then true
    else
        false
    end

{% endmacro %}