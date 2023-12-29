---
sidebar_position: 1
dbt_docs_base_url: https://re-data.github.io/dbt-re-data
---

# Default metrics

Default metrics are computed for all monitored tables. If you would rather not compute some of them it's easy to change the default metrics list via the `re_data:default_metrics` variable.

```csv title="Sample table for example metrics"
__      title               rental_rate	rating      created_at             is_available
1    	Chamber Italian     4.99    	NC-17       2021-09-01T11:00:00    true
2    	Grosse Wonderful	4.99	    R           2021-09-01T12:00:00    true
3    	Airport Pollock     4.99    	R           2021-09-01T15:00:00    false
4    	Bright Encounters	4.99	    PG-13       2021-09-01T09:00:00    true
5    	Academy Dinosaur	0.99	    PG-13       2021-09-01T08:00:00    false
6    	Ace Goldfinger	    4.99	    G           2021-09-01T10:00:00    false
7    	Adaptation Holes	2.99	    NC-17       2021-09-01T11:00:00    true
8    	Affair Prejudice	2.99       	G           2021-09-01T19:00:00    true
9    	African Egg	        2.99    	G           2021-09-01T20:00:00    true
10    	Agent Truman	    2.99	    PG          2021-09-01T07:00:00    false
11    	Airplane Sierra	    4.99	    PG-13       2021-09-02T09:00:00    true
12    	Alabama Devil	    2.99	    PG-13       2021-09-02T10:00:00    false
13    	Aladdin Calendar	4.99	    NC-17       2021-09-02T11:00:00    false
14    	Alamo Videotape	    0.99	    G           2021-09-02T12:00:00    false
15    	Alaska Phantom	    0.99	    PG          2021-09-02T13:00:00    true
16    	Date Speed	        0.99	    R           2021-09-02T14:00:00    true
17    	Ali Forever	        4.99	    PG          2021-09-02T15:00:00    true
18    	Alice Fantasia	    0.99	    NC-17       2021-09-02T16:00:00    true
19    	Alien Center	    2.99	    NC-17       2021-09-02T17:00:00    true
```

Below is a list of currently available metrics and how they are computed internally by re_data:

## table level metrics

### row_count

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_row_count)

Numbers of rows added to the table in a specific time range.

```sql
row_count = 10 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### freshness

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_freshness)

Information about the latest record in a given time frame. Suppose we calculate the `freshness` metric in the table above for the time window `[2021-09-01T00:00:00, 2021-09-02T00:00:00)`. We observe that the latest record
in that time frame appears in row 9 with `created_at=2021-09-01T20:00:00`. `freshness` is the difference between the end of the time window and the latest record in the time frame in seconds. For this example described, re_data would calculate freshness as:

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

## Column level metrics

### min

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_min)

Minimal value appearing in a given numeric column.

```
min(rental_rate) = 0.99 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### max

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_max)

Maximal value appearing in a given numeric column.

```
max(rental_rate) = 4.99 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### avg

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_avg)

Average of all values appearing in a given numeric column.

```
avg(rental_rate) = 3.79 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### stddev

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_stddev)

The standard deviation of all values appearing in a given numeric column.

```
stddev(rental_rate) = 1.3984117975602022 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### variance

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_variance)

The variance of all values appearing in a given numeric column.

```
variance(rental_rate) = 1.9555555555555557 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### min_length

#### [(source code) ](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_min_length)

Minimal length of all strings appearing in a given column.

```
min_length(rating) = 1 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### [max_length ](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_max_length)

Maximal length of all strings appearing in a given column

```
max_length(rating) = 5 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### avg_length

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_avg_length)

The average length of all strings appearing in a given column

```
avg_length(rating) = 2.4 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### nulls_count

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_nulls_count)

A number of nulls in a given column.

```
nulls_count(rating) = 0 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### missing_count

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_missing_count)

A number of nulls and empty string values in a given column for the specific time range.

```
missing_count(rating) = 0 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### missing_percent

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_missing_percent)

A percentage of nulls and empty string values in a given column for the specific time range.

```
missing_percent(rating) = 0 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### nulls_percent

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_nulls_percent)

A percentage of null values in a given column for the specific time range.

```
nulls_percent(rating) = 0 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### count_true

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_count_true)

The total count of `true` values in a given boolean column for the specific time range.

```
count_true(is_available) = 12 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
```

### count_false

#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_count_false)

The total count of `false` values in a given boolean column for the specific time range.

```
count_false(is_available) = 7 where time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00

```
