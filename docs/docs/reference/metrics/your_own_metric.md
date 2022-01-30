---
sidebar_position: 3
dbt_docs_base_url: https://re-data.github.io/dbt-re-data
---

# Your custom metrics

Defining your own metric is very easy.
You can create both table-level or column-level metrics.

Metrics can be defined in any place in your dbt project, as macros with names following the pattern: `re_data_metric_(your_name)` 

 - Both column and table level metrics take a dictionary called `context`. Any extra configuration passed to a metric in `re_data:monitored` would be merged with the context dicionary.
 - ```python
    # Below is the structure of a context dictionary by default
    {
        "column_name": # contains the name of the column to compute the metric on. null in table metrics
        "table_name": # contains the full table name for reference in metric query definition
        "metric_name": # name of the metric being computed
        "time_filter": # time column used to filter the time window
    }
 ```

Here are examples of custom metrics (one table, one column level)

```sql title="macros/my_metrics.sql"    
{% macro re_data_metric_buy_count(context) %}
    coalesce(
        sum(
            case when event_type = 'buy'
                then 1
            else 0
            end
        ), 0
    )
{% endmacro %}

{% macro re_data_metric_distinct_count(context) %}
    count(distinct( {{context.column_name}} ))
{% endmacro %}

{# a more sophisticated example of custom metric with subquery #}
{% macro re_data_metric_duplicate_values(context) %}
        with temp_table as (
            select {{ context.column_name }} from {{ context.table_name }}
            where {{ in_time_window(context.time_filter) }}
            group by {{ context.column_name }}
            having count(1) > 1
        )
        select coalesce(count(*), 0) from temp_table
{% endmacro %}
```

Some important difference between table and column level metrics are:
 - Table level metrics reference column names directly.
 - Column level metrics reference it through `context.column_name` variable. (Which makes them more re-usable)
 - **Tip:** When using sub queries in custom metrics, remember to filter the records to the time frame in context. We can use [`in_time_window({{context.time_fiter}})`](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.in_time_window) macro to achieve this. The macro [distinct_table_rows](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_distinct_table_rows) is a good example.
 
## Your metric ideas

If you have other suggestions of metrics you would like supported, please let us know on **[Slack! 😊](https://www.getre.io/slack)**
