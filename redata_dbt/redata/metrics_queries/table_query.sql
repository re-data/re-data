-- depends_on: {{ ref('monitored_columns') }}

{% set tables =  run_query(get_tables()) %}
{% set table_results = [] %}

{% for mtable in tables %}

    {%- call statement('metrics', fetch_result=True) -%}
    select
        {{ metrics_table_query(mtable) }}
    from
        {{mtable['full_table_name']}}

    where
        {{mtable['time_filter']}} >= {{ time_window_start() }} and
        {{mtable['time_filter']}} < {{ time_window_end() }}
    {%- endcall -%}

    {%- set result = load_result('metrics')['table'] -%}
    {% set full_table_name = mtable['full_table_name'] %}
    {% do table_results.append({'table': full_table_name, 'result': result}) %}
{% endfor %}

{% for result in table_results %}
    {% set table_name = result.table %}
    {% set m_for_table = result.result %}

    {% for column in m_for_table.columns %}
        
        {% set column_value = column.values()[0] %}
        {% set column_name = column.name %}
        {% set table_column_name, fun = column_name.split('::') %}

        select 
            {{ time_window_start() }} as time_window_start,
            {{ time_window_end() }} as time_window_end,
            '{{table_name}}' as table,
            '{{table_column_name}}' as column,
            '{{fun}}' as metric,
            {{column_value |replace(None, 'null')}} as value

        {% if not loop.last -%} union all {%- endif %}
        {% endfor %}

    {% if not loop.last -%} union all {%- endif %}
{% endfor %}


