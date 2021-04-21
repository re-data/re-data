
{% set tables =  run_query(get_tables()) %}

{% for mtable in tables %}

    select {{current_timestamp()}}, {{current_timestamp()}} - max({{mtable['time_filter']}}) as delay, '{{mtable['full_table_name']}}' as key
    from {{mtable['full_table_name']}}

{% if not loop.last -%} union all {%- endif %}
{% endfor %}