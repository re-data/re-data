
{% set tables =  run_query(get_tables()) %}

{% for mtable in tables %}

    select
        {{ time_window_start() }} as time_window_start,
        {{ time_window_end() }} as time_window_end,
        count(*) as row_count,
        '{{mtable['full_table_name']}}' as key
    from
        {{mtable['full_table_name']}}

    where
        {{mtable['time_filter']}} >= {{ time_window_start() }} and
        {{mtable['time_filter']}} < {{ time_window_end() }}

{% if not loop.last -%} union all {%- endif %}
{% endfor %}