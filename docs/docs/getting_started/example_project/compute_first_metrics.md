---
sidebar_position: 3
---

# Compute first metrics

Now, let's compute the first metrics. We can specify the tables we want to monitor in `dbt_project.yml` as shown below

```yaml title="monitored tables"
vars:
  re_data:alerting_z_score: 3
  re_data:monitored:
    - tables:
        - name: customers
          time_filter: joined_at
        - name: order_items
          time_filter: added_at
        - name: orders
          time_filter: created_at
          # actively_monitored: false (we can disable computing metrics for specific table)
        - name: companies
          time_filter: null # to compute global metrics for this table. (no time window would be used)

      actively_monitored: true # we can set this here to monitor all tables listed, removing the need to specify actively_monitored per table
```

Then we run monitoring, we choose to run it for the first day of 2021:

```bash
dbt run --models package:re_data --vars \
   '{
     "re_data:time_window_start": "2021-01-01 00:00:00",
     "re_data:time_window_end": "2021-01-02 00:00:00"
    }'
```

*Note, if we don't pass time window parameters re_data will compute stats from the previous day*

This computes **[default metrics](/docs/reference/metrics#default-metrics)** for the monitored tables. Let's just see how many customers/order_items/orders we have added in on 01-01-2021.



```sql title="Viewing computed metrics"
select * from toy_shop_re.re_data_metrics where metric in( 'row_count', 'global__row_count');

               table_name               | column_name |  metric   | value |  time_window_start  |   time_window_end
----------------------------------------+-------------+-----------+-------+---------------------+---------------------
 "postgres"."toy_shop"."customers"      |             | row_count         |    15 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
 "postgres"."toy_shop"."order_items"    |             | row_count         |    48 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
 "postgres"."toy_shop"."orders"         |             | row_count         |    20 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
 "postgres"."toy_shop"."companies"      |             | global__row_count |    8  | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
```

We can of course inspect any of those metrics and it maybe also really usefull to write dbt tests for values we expect in those.

Now, let's add some extra metrics to customize monitoring for our needs
