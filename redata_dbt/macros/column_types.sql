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


{% macro get_column_type(column) %}

    {% if column.data_type == 'text' %}
        {{ return('text') }}
    {% elif column.date_type == 'int' %}
        {{ return('numeric') }}
    {% else %}
        {{ return('unknown') }}
    {% endif %}

{% endmacro %}