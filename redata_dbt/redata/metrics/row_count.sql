
{% set tables =  run_query(get_tables()) %}
{% set for_time = modules.datetime.datetime.now() %}

{% set day_ago = (for_time - modules.datetime.timedelta(1)).isoformat() %}

{% for mtable in tables %}

    select
        {{current_timestamp()}},
        count(*) as row_count,
        '{{mtable['full_table_name']}}' as key
    from
        {{mtable['full_table_name']}}

    where

        {{mtable['time_filter']}} > '{{ day_ago }}'

{% if not loop.last -%} union all {%- endif %}
{% endfor %}