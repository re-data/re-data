{% macro final_metric(metric) %}

select * from {{ ref('base_metrics') }} where metric = '{{metric}}'

{% endmacro %}