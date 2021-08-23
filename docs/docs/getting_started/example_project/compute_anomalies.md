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
postgres=> select * from toy_shop_re.re_data_alerting
               table_name               |  column_name  |    metric     |    z_score_value    |     last_value     |       last_avg       |     last_stddev     |   time_window_end
----------------------------------------+---------------+---------------+---------------------+--------------------+----------------------+---------------------+---------------------
 "postgres"."toy_shop"."customers"      | id            | max           | -3.0571164943755322 |                384 |    489.7142857142857 |  34.579737444900324 | 2021-01-15 00:00:00
 "postgres"."toy_shop"."pending_orders" | customer_id   | variance      |  3.0887376302455714 |           56488.25 |   22789.370144606666 |  10910.243565334416 | 2021-01-19 00:00:00
 "postgres"."toy_shop"."pending_orders" | id            | variance      |  3.0925612892843777 | 128442.66666666667 |    51593.13165773044 |  24849.801772794937 | 2021-01-19 00:00:00
 "postgres"."toy_shop"."pending_orders" | customer_id   | min           |   3.808496928945078 |                458 |     84.4090909090909 |   98.09405549238814 | 2021-01-23 00:00:00
 "postgres"."toy_shop"."pending_orders" | id            | min           |   3.835564872916336 |                682 |    120.9090909090909 |  146.28638223602914 | 2021-01-23 00:00:00
 "postgres"."toy_shop"."pending_orders" | amount        | min           |  3.2720668193270566 |                313 |   141.95454545454547 |   52.27443814252701 | 2021-01-23 00:00:00
 "postgres"."toy_shop"."order_items"    |               | row_count     | -3.0530445968041606 |                  0 |    59.47826086956522 |  19.481622027899643 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"         | nowa_kolumna  | count_nulls   | -3.2576351652461364 |                  0 |   23.608695652173914 |   7.247188360352917 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"         | nowa_kolumna  | count_missing | -3.2576351652461364 |                  0 |   23.608695652173914 |   7.247188360352917 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"         | nowa_kolumna2 | count_nulls   | -3.2576351652461364 |                  0 |   23.608695652173914 |   7.247188360352917 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"         | nowa_kolumna2 | count_missing | -3.2576351652461364 |                  0 |   23.608695652173914 |   7.247188360352917 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"         |               | row_count     | -3.2576351652461364 |                  0 |   23.608695652173914 |   7.247188360352917 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."order_items"    |               | freshness     |   4.587317109255619 |             172800 |    90156.52173913043 |   18015.64537453126 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"         |               | freshness     |   4.587317109255619 |             172800 |    90156.52173913043 |   18015.64537453126 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."pending_orders" |               | freshness     |   4.587317109255619 |             172800 |    90156.52173913043 |   18015.64537453126 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"         | status        | min_length    |   4.799999999199999 |                  7 |                 4.12 |  0.6000000000000001 | 2021-01-27 00:00:00
 "postgres"."toy_shop"."orders"         | status        | max_length    |       -4.7999999976 |                  7 |                 7.96 |                 0.2 | 2021-01-27 00:00:00
 "postgres"."toy_shop"."pending_orders" | nowa_kolumna2 | count_nulls   |   3.952512498812359 |                 36 |    9.192307692307692 |   6.782443399066332 | 2021-01-27 00:00:00
 "postgres"."toy_shop"."pending_orders" | nowa_kolumna2 | count_missing |   3.952512498812359 |                 36 |    9.192307692307692 |   6.782443399066332 | 2021-01-27 00:00:00
 "postgres"."toy_shop"."pending_orders" | nowa_kolumna  | count_nulls   |   3.952512498812359 |                 36 |    9.192307692307692 |   6.782443399066332 | 2021-01-27 00:00:00
 "postgres"."toy_shop"."pending_orders" | nowa_kolumna  | count_missing |   3.952512498812359 |                 36 |    9.192307692307692 |   6.782443399066332 | 2021-01-27 00:00:00
 "postgres"."toy_shop"."pending_orders" |               | row_count     |   3.952512498812359 |                 36 |    9.192307692307692 |   6.782443399066332 | 2021-01-27 00:00:00
 "postgres"."toy_shop"."customers"      | age           | count_nulls   |   5.003702330376757 |                  1 | 0.037037037037037035 | 0.19245008972987526 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"      | id            | count_nulls   |   5.003702330376757 |                  1 | 0.037037037037037035 | 0.19245008972987526 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"      | first_name    | count_nulls   |   5.003702330376757 |                  1 | 0.037037037037037035 | 0.19245008972987526 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"      | first_name    | count_missing |   5.003702330376757 |                  1 | 0.037037037037037035 | 0.19245008972987526 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"      | last_name     | count_nulls   |   5.003702330376757 |                  1 | 0.037037037037037035 | 0.19245008972987526 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"      | last_name     | count_missing |   5.003702330376757 |                  1 | 0.037037037037037035 | 0.19245008972987526 | 2021-01-28 00:00:00
 "postgres"."toy_shop"."customers"      | first_name    | min_length    |   5.102520382924569 |                  4 |   3.0357142857142856 |  0.1889822365046136 | 2021-01-29 00:00:00
```

We can see a couple of alerting things here (some things look like false alerts, but most seem to be real problems with data). For example for this:

```sql anomalies example
postgres=> select * from toy_shop_re.re_data_alerting where metric = 'row_count';
               table_name               | column_name |  metric   |    z_score_value    | last_value |      last_avg      |    last_stddev     |   time_window_end
----------------------------------------+-------------+-----------+---------------------+------------+--------------------+--------------------+---------------------
 "postgres"."toy_shop"."order_items"    |             | row_count | -3.0530445968041606 |          0 |  59.47826086956522 | 19.481622027899643 | 2021-01-24 00:00:00
 "postgres"."toy_shop"."orders"         |             | row_count | -3.2576351652461364 |          0 | 23.608695652173914 |  7.247188360352917 | 2021-01-24 00:00:00
```

It seems on 2021-01-23 we didn't get any orders and with an average above 23 orders per day that seems really odd.

You can use the re_data_alerting table as a warning generator that something is not right with your data. You can also integrate re_data metrics any way you want with your current BI tools. And of course, re_data can be run from a command line by Airflow or another scheduling tool.

Congrats on finishing our tutorial! We hope it was useful for you! 🙂

Let us know your thoughts on [Slack!](https://www.re-data.io/slack)
