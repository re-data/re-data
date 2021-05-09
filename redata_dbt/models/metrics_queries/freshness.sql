
{% set tables =  run_query(get_tables()) %}

{%- for mtable in tables %}
    select
        '{{mtable['table_name']}}' as table_name,
        '' as column_name,
        'freshness' as metric,
        {{freshness_expression(mtable['time_filter'])}} as value,
        {{ time_window_end() }} as time_window_end,
        {{- dbt_utils.current_timestamp_in_utc() -}} as computed_on
    from
        {{mtable['table_name']}}
    where
        {{mtable['time_filter']}} < {{- time_window_end() -}}

{%- if not loop.last -%} union all {%- endif %}
{%- endfor %}