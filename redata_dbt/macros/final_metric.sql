{% macro final_metric(metric) %}

select * from {{ ref('table_query') }} where metric = '{{metric}}'

{% endmacro %}