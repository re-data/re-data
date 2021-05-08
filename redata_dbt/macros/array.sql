{% macro first_array_el() %}
    {{ adapter.dispatch('first_array_el')() }}
{% endmacro %}

{% macro default__first_array_el() %}
    [1]
{% endmacro %}

{% macro bigquery__first_array_el() %}
    [offset(0)]
{% endmacro %}