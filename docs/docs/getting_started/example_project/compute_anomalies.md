---
sidebar_position: 5
---

# Checking for anomalies

Now we will compute metrics for the whole last month and check if they are any anomlies there.
We could definitely do it using just dbt command, also on production you most likely will have airflow job computing it daily.
Here for simplicity we will use `re_data run` command which is just calling dbt with proper vars:

```
re_data run --start-date 2021-01-02 --end-date 2021-01-30
```

*Notice we already have Janaury 1st stats, so don't need to recompute them. In case of we want to recompute them, `re_data` will overwrite older ones with new.*

Assuming this completed successfully lets query alerts table:

```sql title="toy_shop_re.re_data_alerting"
select * from toy_shop_re.re_data_alerting
        table_name        | column_name |    metric     |    z_score_value    | last_value |       last_avg       |     last_stddev      |   time_window_end   |        computed_on
--------------------------+-------------+---------------+---------------------+------------+----------------------+----------------------+---------------------+----------------------------
 "toy_shop"."customers"   | id          | max           | -3.0571164943755322 |        384 |    489.7142857142857 |    489.7142857142857 | 2021-01-15 00:00:00 | 2021-06-30 15:29:00.660753
 "toy_shop"."order_items" |             | row_count     | -3.0530445968041606 |          0 |    59.47826086956522 |    59.47826086956522 | 2021-01-24 00:00:00 | 2021-06-30 15:30:54.95368
 "toy_shop"."orders"      |             | row_count     | -3.2576351652461364 |          0 |   23.608695652173914 |   23.608695652173914 | 2021-01-24 00:00:00 | 2021-06-30 15:30:54.95368
 "toy_shop"."order_items" |             | freshness     |   4.587317109255619 |     172800 |    90156.52173913043 |    90156.52173913043 | 2021-01-24 00:00:00 | 2021-06-30 15:30:54.95368
 "toy_shop"."orders"      |             | freshness     |   4.587317109255619 |     172800 |    90156.52173913043 |    90156.52173913043 | 2021-01-24 00:00:00 | 2021-06-30 15:30:54.95368
 "toy_shop"."orders"      | status      | min_length    |   4.799999999199999 |          7 |                 4.12 |                 4.12 | 2021-01-27 00:00:00 | 2021-06-30 15:31:31.717359
 "toy_shop"."orders"      | status      | max_length    |       -4.7999999976 |          7 |                 7.96 |                 7.96 | 2021-01-27 00:00:00 | 2021-06-30 15:31:31.717359
 "toy_shop"."customers"   | first_name  | count_nulls   |   5.003702330376757 |          1 | 0.037037037037037035 | 0.037037037037037035 | 2021-01-28 00:00:00 | 2021-06-30 15:31:44.069717
 "toy_shop"."customers"   | first_name  | count_missing |   5.003702330376757 |          1 | 0.037037037037037035 | 0.037037037037037035 | 2021-01-28 00:00:00 | 2021-06-30 15:31:44.069717
 "toy_shop"."customers"   | id          | count_nulls   |   5.003702330376757 |          1 | 0.037037037037037035 | 0.037037037037037035 | 2021-01-28 00:00:00 | 2021-06-30 15:31:44.069717
 "toy_shop"."customers"   | age         | count_nulls   |   5.003702330376757 |          1 | 0.037037037037037035 | 0.037037037037037035 | 2021-01-28 00:00:00 | 2021-06-30 15:31:44.069717
 "toy_shop"."customers"   | last_name   | count_nulls   |   5.003702330376757 |          1 | 0.037037037037037035 | 0.037037037037037035 | 2021-01-28 00:00:00 | 2021-06-30 15:31:44.069717
 "toy_shop"."customers"   | last_name   | count_missing |   5.003702330376757 |          1 | 0.037037037037037035 | 0.037037037037037035 | 2021-01-28 00:00:00 | 2021-06-30 15:31:44.069717
 "toy_shop"."customers"   | first_name  | min_length    |   5.102520382924569 |          4 |   3.0357142857142856 |   3.0357142857142856 | 2021-01-29 00:00:00 | 2021-06-30 15:31:56.423755
```

We can see a couple of alerting things here (some things look like false alerts, but most seem to be real problems with data). For example for this:

```sql
       table_name        | column_name |  metric   |    z_score_value    | last_value |      last_avg      |   time_window_end
--------------------------+-------------+-----------+---------------------+------------+--------------------+---------------------
 "toy_shop"."order_items" |             | row_count | -3.0530445968041606 |          0 |  59.47826086956522 | 2021-01-24 00:00:00
 "toy_shop"."orders"      |             | row_count | -3.2576351652461364 |          0 | 23.608695652173914 | 2021-01-24 00:00:00
```

It seems on 2021-01-23 we didn't get any orders and with an average above 23 orders per day that seems really odd.

You can use the re_data_alerting table as a warning generator that something is not right with your data. You can also integrate re_data metrics any way you want with your current BI tools. And of course, re_data can be run from a command line by Airflow or another scheduling tool.

Congrats on finishing our tutorial! We hope it was useful for you! 🙂

Let us know your thoughts on [Slack!](https://www.re-data.io/slack)
