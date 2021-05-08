{% set schemas = var('redata:schemas') %}

{% for for_schema in schemas %}
select
    {{table_name(table_schema, table_name) }} as table_name,
    column_name,
    data_type,
    is_nullable,
    {{- is_datetime('data_type') -}} as is_datetime,
    {{- time_filter('column_name', 'data_type') -}} as time_filter
from
{{ tables_in_schema(for_schema) }}

{%- if not loop.last %} union all {%- endif %}
{% endfor %}