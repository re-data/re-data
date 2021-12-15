---
sidebar_position: 2
---

# Observability data

Now, let's compute the first health data. We will use the re_data configuration already defined in the project. Check it out **[in our repo](https://github.com/re-data/re-data/blob/master/getting_started/toy_shop/dbt_project.yml)** - or in your own editor.

## First re_data run

We choose to run re_data for the first day of 2021:

```bash
dbt run --models package:re_data --vars \
   '{
     "re_data:time_window_start": "2021-01-01 00:00:00",
     "re_data:time_window_end": "2021-01-02 00:00:00"
    }'
```

*Note, if we don't pass time window parameters re_data will compute stats from the previous day*

This computes **[metrics](/docs/reference/data_monitoring/metrics#default-metrics)** for the monitored tables. Let's just see how many customers/order_items/orders we have added in on 01-01-2021.

```sql title="Viewing computed metrics"
postgres=> select table_name, metric, value from toy_shop_re.re_data_metrics where metric in( 'row_count', 'global__row_count');
               table_name                |      metric       | value
-----------------------------------------+-------------------+-------
 "postgres"."toy_shop"."orders"          | row_count         |   151
 "postgres"."toy_shop"."companies"       | global__row_count |    49
 "postgres"."toy_shop"."orders_per_age"  | row_count         |   151
 "postgres"."toy_shop"."customers"       | row_count         |    14
 "postgres"."toy_shop"."pending_orders"  | row_count         |    35
 "postgres"."toy_shop"."order_items"     | row_count         |   226
 "postgres"."toy_shop"."revenue_per_age" | row_count         |    17
```

## re_data run for January 2021

On production, we would set up re_data to run daily/hourly/etc. For toy shop, by using the re_data python package command we backfill daily data for the past (whole January 2021)

```
re_data run --start-date 2021-01-01 --end-date 2021-01-30
```

## Looking into anomalies

And now let's look into the `alerting` table to see if `re_data` found anything suspicious for us:


```sql title="Viewing computed anomalies"
postgres=> select table_name, metric, z_score_value, last_value, time_window_end from toy_shop_re.re_data_alerting ;
               table_name               |     metric      |    z_score_value    |     last_value     |   time_window_end
----------------------------------------+-----------------+---------------------+--------------------+---------------------
 "postgres"."toy_shop"."order_items"    | freshness       |  3.0867937457815877 |               2048 | 2021-01-20 00:00:00
 "postgres"."toy_shop"."orders"         | nulls_percent   |   4.248529154190601 | 0.6211180124223602 | 2021-01-21 00:00:00
 "postgres"."toy_shop"."orders"         | min_length      |    -4.2485291562996 |                  2 | 2021-01-21 00:00:00
 "postgres"."toy_shop"."orders"         | distinct_values |   4.248529155349601 |                  6 | 2021-01-21 00:00:00
 "postgres"."toy_shop"."orders_per_age" | nulls_percent   |   4.248529154190601 | 0.6211180124223602 | 2021-01-21 00:00:00
 "postgres"."toy_shop"."orders_per_age" | min_length      |    -4.2485291562996 |                  2 | 2021-01-21 00:00:00
 "postgres"."toy_shop"."customers"      | min             | -3.4050793706927704 |                  0 | 2021-01-21 00:00:00
 "postgres"."toy_shop"."customers"      | avg             | -3.3494095494136444 |  22.88888888888889 | 2021-01-21 00:00:00
 "postgres"."toy_shop"."customers"      | stddev          |  3.1074734473171137 |  22.20728255984533 | 2021-01-21 00:00:00
 "postgres"."toy_shop"."pending_orders" | freshness       |  3.5280241130823335 |              15951 | 2021-01-22 00:00:00
 "postgres"."toy_shop"."customers"      | freshness       |  3.0806274651669603 |              28700 | 2021-01-23 00:00:00
 "postgres"."toy_shop"."customers"      | min_length      |        4.7999999976 |                  4 | 2021-01-26 00:00:00
```

We can see there are a couple of things re_data flagged for us.

In the next setup, let's generate UI to look closer into what's happening.