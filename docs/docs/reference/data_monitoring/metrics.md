---
sidebar_position: 3
dbt_docs_base_url: https://re-data.github.io/dbt-re-data
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

## Time based vs Global metrics

We recommend that most of your metrics computed would be time-based (data is then filtered by the `time_filter` column specified in config.

In cases when such a column is not available (or for some reason you don't want to use it),
re_data can compute global metrics for a table. Global metrics don't filter by time and work on data from the whole table. You can pass `time_filter: null` in the re_data table config to compute global metrics.


## Default metrics

Default metrics are computed for all monitored tables. They can be either:
  - table-level - metric for the whole table
  - column-level - metric for a specific column in the table

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

Below is a list of currently available metrics and how they are computed internally by re_data:

### Default Table level metrics

### [row_count](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_row_count)

Numbers of rows added to the table in a specific time range.

```sql
row_count = 10 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [freshness](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_freshness)

Information about the latest record in a given time frame. Suppose we are calculating the `freshness` metric in the table above for the time window `[2021-09-01T00:00:00, 2021-09-02T00:00:00)`. We observe that the latest record 
in that time frame appears in row 9 with `created_at=2021-09-01T20:00:00`. `freshness` is the difference between the end of the time window and the latest record in the time frame in seconds. For this example described, freshness would be calculated as 
```
2021-09-02T00:00:00 - 2021-09-01T20:00:00 = 14400
```

### schema_changes

Information about schema changes in the monitored table.

Stored separately from the rest of the metrics in the `re_data_schema_changes` model.

:::caution
Schema changes are metric different from the rest.
Because information about schema changes is gathered by comparing schemas
between re_data runs this metric **doesn't** filter changes to time-window specified and
in fact, **doesn't** use time_window settings at all.
:::

### Default Column level metrics

### [min](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_min)

Minimal value appearing in a given numeric column.

```
min(rental_rate) = 0.99 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [max](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_max)

Maximal value appearing in a given numeric column.

```
max(rental_rate) = 4.99 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [avg](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_avg)

Average of all values appearing in a given numeric column.

```
avg(rental_rate) = 3.79 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [stddev](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_stddev)

The standard deviation of all values appearing in a given numeric column.

```
stddev(rental_rate) = 1.3984117975602022 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [variance](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_variance)

The variance of all values appearing in a given numeric column.

```
variance(rental_rate) = 1.9555555555555557 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [min_length](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_min_length)

Minimal length of all strings appearing in a given column.

```
min_length(rating) = 1 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [max_length](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_max_length)

Maximal length of all strings appearing in a given column

```
max_length(rating) = 5 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [avg_length](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_avg_length)

The average length of all strings appearing in a given column

```
avg_length(rating) = 2.4 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [nulls_count](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_nulls_count)

A number of nulls in a given column.

```
nulls_count(rating) = 0 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [missing_count](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_missing_count)

A number of nulls and empty string values in a given column for the specific time range.

```
missing_count(rating) = 0 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [missing_percent](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_missing_percent)

A percentage of nulls and empty string values in a given column for the specific time range.

```
missing_percent(rating) = 0 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [nulls_percent](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_nulls_percent)

A percentage of null values in a given column for the specific time range.

```
nulls_percent(rating) = 0 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

## Extra Metrics
There are metrics provided by re_data but are not computed by default in monitored tables. It is worth noting some of these metrics may be computationally heavy which is why they aren't computed by default.

### Extra Table Metrics

### [distinct_table_rows](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_distinct_table_rows)
This metric computes the distinct number of rows in the given table
```
time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
distinct_rows = 10
```

### Extra Column Metrics

:::info
[`regex_match_expression`](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.regex_match_expression) is resolved at runtime depending on the database in use.
:::
### [match_regex](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_match_regex)

Determines the count of values in a given column that matches the specified regex. Suppose we want to check if
the rating column matches a specific regular expression pattern and we define it in our dbt_project.yml file.
- `regex` **must** be specified for this metric to work else a compiler exception would be raised.

```yaml title="specifying match_regex config"
vars:
  re_data:monitored:
    - tables:
        - name: sample_table
          time_filter: created_at

          metrics:
            column:
              rating:
                - match_regex:
                    regex: ([0-9]+)
```

```sql
select coalesce(
        sum(
            case when {{ regex_match_expression('rating', '([0-9]+)') }}
                then 1
            else 0
            end
        ), 0
    ) from your_table
where created_at between time_window_start and time_window_end

------------------------------------------------------------------------
1    	Chamber Italian     4.99    	NC-17       2021-09-01T11:00:00
4    	Bright Encounters	4.99	    PG-13       2021-09-01T09:00:00
5    	Academy Dinosaur	0.99	    PG-13       2021-09-01T08:00:00
7    	Adaptation Holes	2.99	    NC-17       2021-09-01T11:00:00

match_regex = 4 where created_at is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

### [match_regex_percent](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_match_regex_percent)

Determines the percentage of values in a given column that matches the specified regex.

```
Suppose we use the same configuration for the match_regex metric above, we have
match_regex_percent = 40 where created_at is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

### [not_match_regex](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_not_match_regex)

Determines the count of values in a given column that does **not** match the specified regex.

```
Suppose we pass in ([0-9]+) as our regex parameter,
not_match_regex = 6 where created_at is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

### [distinct_values](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_distinct_values)

Determines the count of values in a given column that are unique.

```
rating	count
-----------------
PG-13	2
G	    3
NC-17	2
PG	    1
R	    2
time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
distinct_values = 5. (PG)
```

### [duplicate_values](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_duplicate_values)

Determines the count of values in a given column that are duplicated.

```
rating	count
-----------------
PG-13	2
G	    3
NC-17	2
PG	    1
R	    2

time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
duplicate_values = 4. (PG-13, G, NC-17, R)
```

### [duplicate_rows](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_duplicate_rows)

Determines the count of rows in a given column that have values which are duplicates.

```
rating	count
-----------------
PG-13	2
G	    3
NC-17	2
PG	    1
R	    2

time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
duplicate_count = 9. (PG-13[2], G[3], NC-17[2], R[2])
```

### [unique_rows](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_unique_rows)
Determines the count of rows in a given column that have values which are unique.

```
rating	count
-----------------
PG-13	2
G	    3
NC-17	2
PG	    1
R	    2

time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
distinct_count = 1 (PG)
```

### [approx_distinct_values](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_approx_distinct_values)
Determines the approximate distinct count of values in a given column. This metric is useful in large tables where an approximation is sufficient and query performance is required. <br/>
**Note:** Postgres does not support for approximate count of distinct values unlike [bigquery](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.bigquery__approx_distinct_values), [snowflake](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.snowflake__approx_distinct_values) and [redshift](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.redshift__approx_distinct_values).




## Defining your metric

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
```

Some important difference between table and column level metrics are:
 - Table level metrics reference column names directly.
 - Column level metrics reference it through `context.column_name` variable. (Which makes them more re-usable)
 - **Tip:** When using sub queries in custom metrics, remember to filter the records to the time frame in context. We can use [`in_time_window({{context.time_fiter}})`](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.in_time_window) macro to achieve this. The macro [distinct_table_rows](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_distinct_table_rows) is a good example.
 
## Your metric ideas

If you have other suggestions of metrics you would like supported, please let us know on **[Slack! 😊](https://join.slack.com/t/re-data/shared_invite/zt-vkauq1y8-tL4R4_H5nZoVvyXyy0hdug)**
