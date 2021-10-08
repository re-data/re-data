---
sidebar_position: 3
---

# Metrics

## How metrics look like 

re_data metrics are currently *just* expressions which
are added to select statements run automatically by re_data.

```sql title="re_data query"
select metric1, metric2, metric3
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

## Built-in metrics

Built-in metrics are default computed for all monitored tables. They can be either:
  - table-level - metric for the whole table
  - column level - metric for a specific column in the table

Almost all metrics can be found in the `re_data_metrics` model crated by re_data.
Apart from that re_data also creates models from specific metrics (As views filtering from metrics table)

```csv title="Sample table for example metrics"
__      title               rental_rate	rating      created_at
1    	Chamber Italian     4.99    	NC-17       2021-09-01T11:00:00
2    	Grosse Wonderful	4.99	    R           2021-09-01T12:00:00
3    	Airport Pollock     4.99    	R           2021-09-01T15:00:00
4    	Bright Encounters	4.99	    PG-13       2021-09-01T09:00:00
5    	Academy Dinosaur	0.99	    PG-13       2021-09-01T08:00:00
6    	Ace Goldfinger	    4.99	    G           2021-09-01T10:00:00
7    	Adaptation Holes	2.99	    NC-17       2021-09-01T11:00:00
8    	Affair Prejudice	2.99       	G           2021-09-01T19:00:00
9    	African Egg	        2.99    	G           2021-09-01T20:00:00
10    	Agent Truman	    2.99	    PG          2021-09-01T07:00:00
11    	Airplane Sierra	    4.99	    PG-13       2021-09-02T09:00:00
12    	Alabama Devil	    2.99	    PG-13       2021-09-02T10:00:00
13    	Aladdin Calendar	4.99	    NC-17       2021-09-02T11:00:00
14    	Alamo Videotape	    0.99	    G           2021-09-02T12:00:00
15    	Alaska Phantom	    0.99	    PG          2021-09-02T13:00:00
16    	Date Speed	        0.99	    R           2021-09-02T14:00:00
17    	Ali Forever	        4.99	    PG          2021-09-02T15:00:00
18    	Alice Fantasia	    0.99	    NC-17       2021-09-02T16:00:00
19    	Alien Center	    2.99	    NC-17       2021-09-02T17:00:00
```

Below is a list of currently available metrics and how they are computed internally by `re_data`:

### Table level metrics

#### row_count

Numbers of rows added to the table in a specific time range.

```sql title="row_count"
select count(1) from your_table
where time_filter in time_window

-- row_count = 10 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

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

Minimal value appearing in a given numeric column.

```sql title="min"
select min(rental_rate) from your_table
where time_filter in time_window

-- min = 0.99 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### max

Maximal value appearing in a given numeric column.

```sql title="max"
select max(rental_rate) from your_table
where time_filter in time_window

-- max = 4.99 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### avg

Average of all values appearing in a given numeric column.

```sql title="avg"
select avg(rental_rate) from your_table
where time_filter in time_window

-- avg = 3.79 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### stddev

The standard deviation of all values appearing in a given numeric column.

```sql title="stddev"
select stddev(rental_rate) from your_table
where time_filter in time_window

-- stddev = 1.3984117975602022 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### variance

The variance of all values appearing in a given numeric column.

```sql title="variance"
select variance(rental_rate) from your_table
where time_filter in time_window

-- variance = 1.9555555555555557 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### min_length

Minimal length of all strings appearing in a given column.

```sql title="min_length"
select min(length(rating)) from your_table
where time_filter in time_window

-- min_length = 1 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### max_length

Maximal length of all strings appearing in a given column

```sql title="max_length"
select max(length(rating)) from your_table
where time_filter in time_window

-- max_length = 5 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### avg_length

The average length of all strings appearing in a given column

```sql title="avg_length"
select avg(cast (length(rating))) from your_table
where time_filter in time_window

-- avg_length = 2.4 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### nulls_count

A number of nulls in a given column.

```sql title="nulls_count"
select coalesce(
        sum(
            case when rating is null
                then 1
            else 0
            end
        ), 0
    ) from your_table
where time_filter in time_window

-- nulls_count = 0 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### missing_count

A number of nulls and empty string values in a given column for the specific time range.

```sql title="missing_count"
select coalesce(
        sum(
            case 
            when rating is null
                then 1
            when rating = ''
                then 1
            else 0
            end
        ), 0
    ) from your_table
where time_filter in time_window

-- missing_count = 0 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### missing_percent

A percentage of nulls and empty string values in a given column for the specific time range.

```sql title="missing_percent"
select coalesce(
        sum(
            case 
            when rating is null
                then 1
            when rating = ''
                then 1
            else 0
            end
        ), 0
    ) / count(1) * 100.0 from your_table
where time_filter in time_window

-- missing_percent = 0 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### nulls_percent

A percentage of null values in a given column for the specific time range.

```sql title="nulls_percent"
select coalesce(
        sum(
            case when rating is null
                then 1
            else 0
            end
        ), 0
    ) / count(1) * 100.0 from your_table
where time_filter in time_window

-- nulls_percent = 0 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

:::info
`regex_match_expression` is resolved at runtime depending on the database in use.  <br />
Postgres/Redshift: column_name ~ '[regex]'  <br /> 
BigQuery: REGEXP_CONTAINS(column_name, '[regex]')  <br />
Snoflake: REGEXP_LIKE(column_name, '[regex]')
:::
#### match_regex

Determines the count of values in a given column that matches the specified regex.

```sql title="match_regex"
select coalesce(
        sum(
            case when {{ regex_match_expression('rating', '[0-9]+') }}
                then 1
            else 0
            end
        ), 0
    ) from your_table
where time_filter in time_window

-- match_regex = 4 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### match_regex_percent

Determines the percentage of values in a given column that matches the specified regex.

```sql title="match_regex_percent"
select coalesce(
        sum(
            case when {{ regex_match_expression('rating', '[0-9]+') }}
                then 1
            else 0
            end
        ), 0
    ) / count(1) * 100.0 from your_table
where time_filter in time_window

-- match_regex_percent = 40 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### not_match_regex

Determines the count of values in a given column that does not match the specified regex.

```sql title="not_match_regex"
select count(1) - coalesce(
        sum(
            case when {{ regex_match_expression('rating', '[0-9]+') }}
                then 1
            else 0
            end
        ), 0
    ) from your_table
where time_filter in time_window

-- not_match_regex = 6 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

#### not_match_regex_percent

Determines the pecentage of values in a given column that does not match the specified regex.

```sql title="not_match_regex_percent"
select (
    count(1) - coalesce(
        sum(
            case when {{ regex_match_expression('rating', '[0-9]+') }}
                then 1
            else 0
            end
        ), 0
    )
) / count(1) * 100.0 from your_table
where time_filter in time_window

-- not_match_regex_percent = 60 where time window is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```


## Defining your metric

Defining your own metric is very easy.
You can create both table-level or column-level metrics.

Metrics can be defined in any place in your dbt project, as macros with names following the pattern: `re_data_metric_(your_name)` 

 - Both column and table level metrics take a dictionary called `context`
 - ```python
    # Below is the structure of a context dictionary
    {
        "column_name": # contains the name of the column to compute the metric on. null in table metrics
        "table_name": # contains the full table name for reference in metric query definition
        "metric_name": # name of the metric being computed
        "time_filter": # time window the metric is computed on
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
```

Import difference between table and column level metrics is.
 - Table level metrics reference column names directly.
 - Column level metrics reference it thought `context.column_name` variable. (Which makes them more re-usable)
 
## Your metric ideas

Currently, all built-in metrics are also computed by default, but we intend to add metrics that will be built-in but optional (`distinct_count` being an example of such metric). If you have other suggestions of such metrics let us know on **[Slack! 😊](https://join.slack.com/t/re-data/shared_invite/zt-vkauq1y8-tL4R4_H5nZoVvyXyy0hdug)**
