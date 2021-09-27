---
sidebar_position: 3
---

# Metrics

## How metrics look like 

re_data metrics are currently *just* expressions which
are added to select statements run automatically by re_data.

```sql title="re_data query"
select metrcic1, metrcic2, metrcic3
from your_table
where data in time_window
```

These simple definitions still make it possible to create a wide variety of metrics.
If metrics you would like to monitor are more complicated than that, we advise creating dbt models filtering/joining/grouping data and monitoring models created with re_data.

## Time based

re_data metrics are time-based. (re_data filters all your table data to a specific time window.) You can choose any time window with proper **[config](/docs/reference/config)**.

:::info
Why do we only support time-based metrics? We believe all datasets gain in quality when they have some time-based column (think `creation_time`, `ingestion_time`, etc.) added to them. This way you know when data is coming, or when it was created, etc. Without a time-based mark, it's quite hard to define metrics & anomalies properly. Let us know if you think for your use-case it doesn't make sense.
:::

## Build-in metrics

Build-in metrics are default computed for all monitored tables. They can be either:
  - table-level - metric for the whole table
  - column level - metric for a specific column in the table

Almost all metrics can be found in the `re_data_metrics` model crated by re_data.
Apart from that re_data also creates models from specific metrics (As views filtering from metrics table)

List of all currently available metrics:

### Table level metrics

#### row_count

Numbers of rows added to the table in a specific time range.

#### freshness

Information about the oldest record which appeared in table.
`null` in case of no data appearing in monitored time-widow.

#### schema_changes

Information about schema changes in the monitored table.

Stored separately from the rest of the metrics in the `re_data_schema_changes` model.

:::caution
Schema changes are metric different from the rest.
Because information about schema changes is gathered by comparing schemas
between re_data runs this metric **doesn't** filter changes to time-window specified and
in fact, **doesn't** use time_window settings at all.
:::

### Column level metrics

#### min

Minimal value appearing in a given column.

#### max

Maximal value appearing in a given column.

#### avg

Average of all values appearing in a given column.

#### stddev

The standard deviation of all values appearing in a given column.

#### variance

The variance of all values appearing in a given column.

#### nulls_count

A number of nulls in a given column.

#### min_length

Minimal length of all strings appearing in a given column.

#### max_length

Maximal length of all strings appearing in a given column

#### avg_length

The average length of all strings appearing in a given column

#### missing_count

A number of nulls and empty string values in a given column for the specific time range.

#### missing_percent

A percentage of nulls and empty string values in a given column for the specific time range.

#### nulls_percent

A percentage of null values in a given column for the specific time range.


## Defining your metric

Defining your own metric is very easy.
You can create both table-level or column-level metrics.

Metrics can be defined in any place in your dbt project, as macros with names following the pattern: `re_data_metric_(your_name)` 

 - Table level metrics take (optional) time_column argument.
 - Column level metrics take the column_name argument which needs to be used.

Here are examples of custom metrics (one table, one column level)

```sql title="macros/my_metrics.sql"    
{% macro re_data_metric_buy_count(time_column) %}
    coalesce(
        sum(
            case when event_type = 'buy'
                then 1
            else 0
            end
        ), 0
    )
{% endmacro %}

{% macro re_data_metric_distinct_count(column_name) %}
    count(distinct( {{column_name}} ))
{% endmacro %}
```

Import difference between table and column level metrics is.
 - Table level metrics reference column names directly.
 - Column level metrics reference it thought `column_name` variable. (Which makes them more re-usable)
 
## Your metric ideas

Currently, all build-in metrics are also computed by default, but we intend to add metrics that will be build-in but optional (`distinct_count` being an example of such metric). If you have other suggestions of such metrics let us know on **[Slack! 😊](https://www.re-data.io/slack)**