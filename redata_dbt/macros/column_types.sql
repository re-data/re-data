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
    
    {% if column.data_type in [
        "character varying",
        "varchar",
        "character",
        "char",
        "text"
    ] %}
        {{ return('text') }}
        
    {% elif column.data_type in [
            "smallint",
            "integer",
            "bigint",
            "decimal",
            "numeric",
            "real",
            "double precision",
            "enum",
        ] %}
        {{ return('numeric') }}
    {% else %}
        {{ return('unknown') }}
    {% endif %}

{% endmacro %}