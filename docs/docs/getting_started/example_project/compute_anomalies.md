---
sidebar_position: 5
---

# Checking for anomalies

Now we will compute metrics for the whole last month and check if there are any anomalies present.
We could definitely do it using just a dbt command. As well, in production you most likely will have airflow jobs computing it daily.
Here, for simplicity, we will use the `re_data run` command, which is just calling dbt with proper vars:

```
re_data run --start-date 2021-01-02 --end-date 2021-01-30
```

*Notice we already have Janaury 1st stats, so we don't need to recompute them. In case we want to recompute them, `re_data` will overwrite older stats with new.*

Assuming this completed successfully, let's query the alerts table:

```sql title="toy_shop_re.re_data_alerting"
postgres=> select table_name, column_name, metric, z_score_value, time_window_end from toy_shop_re.re_data_alerting;
             table_name              | column_name |    metric     |    z_score_value    |   time_window_end
-------------------------------------+-------------+---------------+---------------------+---------------------
 "postgres"."toy_shop"."customers"   | id          | max           | -3.0571164943755322 | 2021-01-15 00:00:00
 "postgres"."toy_shop"."order_items" |             | row_count     | -3.0530445968041606 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"      |             | row_count     | -3.2576351652461364 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"      | status      | min_length    |   4.799999999199999 | 2021-01-27 00:00:00
 "postgres"."toy_shop"."orders"      | status      | max_length    |       -4.7999999976 | 2021-01-27 00:00:00
 "postgres"."toy_shop"."customers"   | id          | nulls_count   |   5.003702330376757 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"   | age         | nulls_count   |   5.003702330376757 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"   | first_name  | nulls_count   |   5.003702330376757 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"   | first_name  | missing_count |   5.003702330376757 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"   | last_name   | nulls_count   |   5.003702330376757 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"   | last_name   | missing_count |   5.003702330376757 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"   | first_name  | min_length    |   5.102520382924569 | 2021-01-29 00:00:00
```

We can see a couple of alerting things here (some things look like false alerts, but most seem to be real problems with data). For example for this:

```sql anomalies example
postgres=> select * from toy_shop_re.re_data_alerting where metric = 'row_count';
               table_name               | column_name |  metric   |    z_score_value    | last_value |      last_avg      |    last_stddev     |   time_window_end
----------------------------------------+-------------+-----------+---------------------+------------+--------------------+--------------------+---------------------
 "postgres"."toy_shop"."order_items"    |             | row_count | -3.0530445968041606 |          0 |  59.47826086956522 | 19.481622027899643 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"         |             | row_count | -3.2576351652461364 |          0 | 23.608695652173914 |  7.247188360352917 | 2021-01-24 00:00:00
```

It seems on 2021-01-23 we didn't get any orders. With an average of more than 23 orders per day, that seems really odd.

You can use the re_data_alerting table as a warning generator that something is not right with your data.