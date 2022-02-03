---
sidebar_position: 2
---

# Reliability data

Now, let's compute the first health data. We will use the re_data configuration already defined in the project. Check it out **[in our repo](https://github.com/re-data/re-data/blob/master/getting_started/toy_shop/dbt_project.yml)**

## First re_data run

We choose to run re_data for the first day of 2021:

```bash
dbt run --models package:re_data --vars \
   '{
     "re_data:time_window_start": "2021-01-01 00:00:00",
     "re_data:time_window_end": "2021-01-02 00:00:00"
    }'
```

:::info
Note, if we don't pass time window parameters re_data will compute stats for the previous day.
:::

This computes metrics for the monitored tables. Let's just see how many customers/order_items/orders we have added in on 01-01-2021.

```sql title="Viewing computed metrics"
select table_name, metric, value from toy_shop_re.re_data_metrics where metric in( 'row_count', 'global__row_count');

                     table_name                     |      metric       | value
----------------------------------------------------+-------------------+-------
 "postgres"."toy_shop"."orders_per_age"             | row_count         |   475
 "postgres"."toy_shop"."companies"                  | global__row_count |    49
 "postgres"."toy_shop"."pending_orders"             | row_count         |   162
 "postgres"."toy_shop"."order_items"                | row_count         |   661
 "postgres"."toy_shop"."revenue_per_age"            | row_count         |   149
 "postgres"."toy_shop"."orders"                     | row_count         |   475
 "postgres"."toy_shop_sources"."toy_shop_customers" | row_count         |    14
```

## re_data run for ten first days of January

On production, we would set up re_data to run daily/hourly/etc. For toy shop, by using the re_data python package command we backfill daily data for the past.

```
re_data run --start-date 2021-01-01 --end-date 2021-01-11
```

## Looking into anomalies

And now let's look into the `alerting` table to see if `re_data` found anything suspicious for us:


```sql title="Viewing computed anomalies"

select table_name, metric, z_score_value, last_value, time_window_end from toy_shop_re.re_data_anomalies;


                     table_name                     |     metric      |    z_score_value    |     last_value     |   time_window_end
----------------------------------------------------+-----------------+---------------------+--------------------+---------------------
 "postgres"."toy_shop"."orders_per_age"             | row_count       | -2.0813250940629247 |                447 | 2021-01-09 00:00:00
 "postgres"."toy_shop"."orders"                     | row_count       | -2.0813250940629247 |                447 | 2021-01-09 00:00:00
 "postgres"."toy_shop"."orders_per_age"             | min             |  2.8460498932515366 |                 51 | 2021-01-11 00:00:00
 "postgres"."toy_shop"."orders_per_age"             | nulls_percent   |  2.8460498934090412 | 1.2121212121212122 | 2021-01-11 00:00:00
 "postgres"."toy_shop"."orders_per_age"             | min_length      |  -2.846049893701541 |                  2 | 2021-01-11 00:00:00
 "postgres"."toy_shop"."orders_per_age"             | avg_length      |   -2.20745908506349 | 6.4363636363636365 | 2021-01-11 00:00:00
 "postgres"."toy_shop"."orders"                     | min             |  2.8460498932515366 |                 51 | 2021-01-11 00:00:00
 "postgres"."toy_shop"."orders"                     | nulls_percent   |  2.8460498934090412 | 1.2121212121212122 | 2021-01-11 00:00:00
 "postgres"."toy_shop"."orders"                     | min_length      |  -2.846049893701541 |                  2 | 2021-01-11 00:00:00
 "postgres"."toy_shop"."orders"                     | avg_length      |   -2.20745908506349 | 6.4363636363636365 | 2021-01-11 00:00:00
 "postgres"."toy_shop"."orders"                     | distinct_values |  2.8460498940015415 |                  9 | 2021-01-11 00:00:00
 "postgres"."toy_shop_sources"."toy_shop_customers" | row_count       |  2.0283702112970112 |                 25 | 2021-01-11 00:00:00

We can see there are a couple of things re_data flagged for us.

## Running tests

Before moving on and investigating it in re_data UI. Let's run tests to see if they point to any problems in our data:


```bash title="Running tests"
$ dbt test

...

10:40:49  Finished running 31 tests, 1 hook in 5.43s.
10:40:49
10:40:49  Completed with 3 errors and 0 warnings:
10:40:49
10:40:49  Failure in test accepted_values_orders_status__pending__shipped__delivered__not_paid__paid (seeds/schema.yml)
10:40:49    Got 6 results, configured to fail if != 0
10:40:49
10:40:49    compiled SQL at target/compiled/toy_shop/seeds/schema.yml/accepted_values_orders_a63e7616d678ec9b14b0f2b1cb0f332a.sql
10:40:49
10:40:49  Failure in test not_null_orders_amount (seeds/schema.yml)
10:40:49    Got 6 results, configured to fail if != 0
10:40:49
10:40:49    compiled SQL at target/compiled/toy_shop/seeds/schema.yml/not_null_orders_amount.sql
10:40:49
10:40:49  Failure in test source_not_null_toy_shop_sources_toy_shop_customers_age (sources/schema.yml)
10:40:49    Got 94 results, configured to fail if != 0
10:40:49
10:40:49    compiled SQL at target/compiled/toy_shop/sources/schema.yml/source_not_null_toy_shop_sources_toy_shop_customers_age.sql
10:40:49
10:40:49  Done. PASS=28 WARN=0 ERROR=3 SKIP=0 TOTAL=31

```


Ok, so some of the tests are failing. At least they should fail for you ... 😊

Let's move to the next chapter and investigate what's going on.