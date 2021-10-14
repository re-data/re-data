---
sidebar_position: 4
---

# Specifying extra metrics

Now that we have computed default metrics for the current monitored tables, we can specify extra metrics 
to compute at table or column level. See [defining your metric](/docs/reference/metrics#defining-your-metric) to set up custom metrics.

Here is an example showing how to add these metrics to the `customers` table.

```yml title="dbt_project.yml vars"
vars:
  re_data:monitored:
      - tables:
        - name: customers
          time_filter: joined_at
          metrics:
            table: # computing table level metrics
                - distinct_table_rows
            column:
                first_name: # computing metrics for the first_name column only
                    - distinct_values
                    - match_regex:
                        regex: (Emily) # match rows with this name
```

Metrics: `distinct_table_rows`, `distinct_table_rows`, `match_regex` are already defined in `re_data` so we just need to reference them here to let re_data now to compute them.

Once again, we run data, let's do it for the same day as previously (metrics for the first day of 2021 would be overwritten)

```bash
dbt run --models package:re_data --vars \
   '{
     "re_data:time_window_start": "2021-01-01 00:00:00",
     "re_data:time_window_end": "2021-01-02 00:00:00"
    }'
```

And now we can inspect ours extra metrics in SQL:

```sql
select table_name, column_name, metric, value, time_window_start, time_window_end from new_toy_shop_re.re_data_metrics
where metric in ('distinct_table_rows', 'distinct_values', 'match_regex');

               table_name              | column_name  |  metric             | value |  time_window_start  |   time_window_end
---------------------------------------+-------------+---------------------+-------+---------------------+---------------------
"postgres"."toy_shop"."customers"      | first_name   | distinct_values     |    12 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
"postgres"."toy_shop"."customers"      | first_name   | match_regex         |    3  | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
"postgres"."toy_shop"."customers"      |              | distinct_table_rows |    15 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00

```

What if we have a metric that is quite special for us and isn't available in re_data? No problem, we can define it ourselves and let re_data compute it. Let's check how to do it: