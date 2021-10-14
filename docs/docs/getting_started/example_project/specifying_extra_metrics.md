---
sidebar_position: 4
---

# Specifying extra metrics

Now that we have computed default metrics for the current monitored tables, we can specify extra/custom metrics 
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

```sql
select table_name, column_name, metric, value, time_window_start, time_window_end from new_toy_shop_re.re_data_metrics
where metric in ('distinct_table_rows', 'distinct_values', 'match_regex');

               table_name              | column_name  |  metric             | value |  time_window_start  |   time_window_end
---------------------------------------+-------------+---------------------+-------+---------------------+---------------------
"postgres"."toy_shop"."customers"      | first_name   | distinct_values     |    12 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
"postgres"."toy_shop"."customers"      | first_name   | match_regex         |    3  | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
"postgres"."toy_shop"."customers"      |              | distinct_table_rows |    15 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00

```