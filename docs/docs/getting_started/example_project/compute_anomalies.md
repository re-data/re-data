---
sidebar_position: 6
---

# Checking for anomalies

Now we will compute metrics for the whole last month and check if there are any anomalies present.

But before we do that let's make sure that after playing with custom metrics we do have following setup in `dbt_project.yml`

```yaml title="monitored tables"
vars:
  re_data:alerting_z_score: 3
  re_data:schemas:
    - toy_shop
  re_data:monitored:
    - tables:
        - name: customers
          time_filter: joined_at
        - name: order_items
          time_filter: added_at
        - name: orders
          time_filter: created_at
      actively_monitored: true
```

We could compute anomalies using just a dbt command. In production you most likely will have airflow job or dbt cloud job computing it daily.

Here, for simplicity, we will use the `re_data run` command, which is just calling dbt with proper vars:

```
re_data run --start-date 2021-01-01 --end-date 2021-01-30
```

Assuming this completed successfully, let's query the alerts table:

```sql title="toy_shop_re.re_data_alerting"
select table_name, column_name, metric, z_score_value, time_window_end from toy_shop_re.re_data_alerting;

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
select * from toy_shop_re.re_data_alerting where metric = 'row_count';

               table_name               | column_name |  metric   |    z_score_value    | last_value |      last_avg      |    last_stddev     |   time_window_end
----------------------------------------+-------------+-----------+---------------------+------------+--------------------+--------------------+---------------------
 "postgres"."toy_shop"."order_items"    |             | row_count | -3.0530445968041606 |          0 |  59.47826086956522 | 19.481622027899643 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"         |             | row_count | -3.2576351652461364 |          0 | 23.608695652173914 |  7.247188360352917 | 2021-01-24 00:00:00
```

It seems on 2021-01-23 we didn't get any orders. With an average of more than 23 orders per day, that seems really odd.

You can use the re_data_alerting table as a warning generator that something is not right with your data.

Now let's to move final part of tutorial and let's check how `re_data` can help with detecting changes in current database schema.