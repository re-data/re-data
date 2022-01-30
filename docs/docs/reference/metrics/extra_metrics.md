---
sidebar_position: 2
dbt_docs_base_url: https://re-data.github.io/dbt-re-data
---

# Extra Metrics
There are metrics provided by re_data but are not computed by default in monitored tables. You can enable them by updating the configuration for the specific table. You can also make the base metrics by adding them to `re_data:metrics_base`.

```csv title="Sample table for which we compute extra metrics"
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

## Extra Table Metrics

### distinct_table_rows
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_distinct_table_rows)
This metric computes the distinct number of rows in the given table
```
time window is >= 2021-09-01T00:00:00 and < 2021-09-02T00:00:00
distinct_rows = 10
```

## Extra Column Metrics

:::info
[`regex_match_expression`](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.regex_match_expression) is resolved at runtime depending on the database in use.
:::
### match_regex
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_match_regex)

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

### match_regex_percent
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_match_regex_percent)

Determines the percentage of values in a given column that matches the specified regex.

```
Suppose we use the same configuration for the match_regex metric above, we have
match_regex_percent = 40 where created_at is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

### not_match_regex
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_not_match_regex)

Determines the count of values in a given column that does **not** match the specified regex.

```
Suppose we pass in ([0-9]+) as our regex parameter,
not_match_regex = 6 where created_at is between 2021-09-01T00:00:00 and 2021-09-02T00:00:00
```

### distinct_values
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_distinct_values)

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

### duplicate_values
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_duplicate_values)

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

### duplicate_rows
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_duplicate_rows)

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

### unique_rows
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_unique_rows)
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

### approx_distinct_values
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_approx_distinct_values)
Determines the approximate distinct count of values in a given column. This metric is useful in large tables where an approximation is sufficient and query performance is required. <br/>
**Note:** Postgres does not support for approximate count of distinct values unlike [bigquery](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.bigquery__approx_distinct_values), [snowflake](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.snowflake__approx_distinct_values) and [redshift](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.redshift__approx_distinct_values).


