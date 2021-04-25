{% macro column_expression(column_name, func) %}

    {% if func == 'max' %}
        max({{column_name}})
    {% endif %}

    {% if func == 'min' %}
        min({{column_name}})
    {% endif %}

    {% if func == 'avg' %}
        avg({{column_name}})
    {% endif %}

    {% if func == 'max_length' %}
        max(length({{column_name}}))
    {% endif %}

    {% if func == 'min_length' %}
        min(length({{column_name}}))
    {% endif %}

    {% if func == 'avg_length' %}
        avg(length({{column_name}}))
    {% endif %}

    {% if func == 'count_nulls' %}
        coalesce(
            sum(
                case when {{column_name}} is null
                    then 1
                else 0
                end
            ), 0
        )
    {% endif %}

    {% if func == 'count_missing' %}
        coalesce(
            sum(
                case 
                when {{column_name}} is null
                    then 1
                when {{column_name}} = ''
                    then 1
                else 0
                end
            ), 0
        )
    {% endif %}

{% endmacro %}