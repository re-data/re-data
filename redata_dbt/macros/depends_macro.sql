{% macro generate_depends(used_tables) %}
    {% for t in used_tables %}
        -- depends_on: {{ ref(t) }}
    {% endfor %}

{% endmacro %}