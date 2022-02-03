---
sidebar_position: 5
---

# Models

All data produced by re_data is saved in dbt models. Here we describe what those models mean and show some sample data they contain.

### re_data_metrics

This model contains (almost all - except schema changes) metrics computed by re_data. Here is what this table looks like:
```sql title="re_data_metrics" 
                id                |               table_name               | column_name |    metric     |       value        |  time_window_start  |   time_window_end   | interval_length_sec |        computed_on
----------------------------------+----------------------------------------+-------------+---------------+--------------------+---------------------+---------------------+---------------------+----------------------------
 84a9d139c54fc726e9422506bf801a17 | "postgres"."toy_shop"."orders_per_age" | amount      | min           |                 52 | 2021-01-04 00:00:00 | 2021-01-05 00:00:00 |               86400 | 2022-01-20 13:51:34.054734
 ccca51c65ff39fb1597369466f50d184 | "postgres"."toy_shop"."orders_per_age" | amount      | max           |                200 | 2021-01-04 00:00:00 | 2021-01-05 00:00:00 |               86400 | 2022-01-20 13:51:34.054734
 91cbf631c912879568c872bb85072329 | "postgres"."toy_shop"."orders_per_age" | amount      | avg           | 124.99378881987577 | 2021-01-04 00:00:00 | 2021-01-05 00:00:00 |               86400 | 2022-01-20 13:51:34.054734
 aa76192540ae52a22eb7272477b8a9ca | "postgres"."toy_shop"."orders_per_age" | amount      | stddev        | 42.942621149391016 | 2021-01-04 00:00:00 | 2021-01-05 00:00:00 |               86400 | 2022-01-20 13:51:34.054734
 ad4a2c8483217a748cdc520f159ba239 | "postgres"."toy_shop"."orders_per_age" | amount      | nulls_percent |                  0 | 2021-01-04 00:00:00 | 2021-01-05 00:00:00 |               86400 | 2022-01-20 13:51:34.054734
```

### re_data_schema_changes

Schema changes are computed separately. This model contains all detected schema changes.


```sql title="re_data_schema_changes" 
                id                |                     table_name                     |   operation    | column_name |          data_type          | is_nullable | prev_column_name |       prev_data_type        | prev_is_nullable |       detected_time
----------------------------------+----------------------------------------------------+----------------+-------------+-----------------------------+-------------+------------------+-----------------------------+------------------+----------------------------
 d7d0a39b324e4e073d75783cd4f66b61 | "postgres"."toy_shop_sources"."toy_shop_customers" | column_added   | last_name   | text                        | t           |                  |                             |                  | 2022-01-20 11:53:01.779986
 2c752a1614e50740a4e18f04528026f7 | "postgres"."toy_shop_sources"."toy_shop_customers" | column_added   | first_name  | text                        | t           |                  |                             |                  | 2022-01-20 11:53:01.779986
 d5b02ec481a1a032ea1e7a06d3c11402 | "postgres"."toy_shop_sources"."toy_shop_customers" | column_added   | joined_at   | timestamp without time zone | t           |                  |                             |                  | 2022-01-20 11:53:01.779986
```

### re_data_monitored


This model refreshes each time re_data runs and describes what tables re_data monitors. It is generated from your configuration.


```sql title="re_data_monitored"
        name        |      schema      | database | time_filter |                                  metrics                                   |       columns
--------------------+------------------+----------+-------------+----------------------------------------------------------------------------+----------------------
 pending_orders     | toy_shop         | postgres | created_at  | {"table": ["orders_above_100"], "column": {"status": ["distinct_values"]}} | ["amount", "status"]
 revenue_per_age    | toy_shop         | postgres | created_at  | {}                                                                         | []
 orders_per_age     | toy_shop         | postgres | created_at  | {"table": ["orders_above_100"], "columns": ["amount", "status", "age"]}    | []
 orders             | toy_shop         | postgres | created_at  | {"table": ["orders_above_100"], "column": {"status": ["distinct_values"]}} | []
 order_items        | toy_shop         | postgres | added_at    | {}                                                                         | ["name", "amount"]
 toy_shop_customers | toy_shop_sources | postgres | joined_at   | {}                                                                         | []
```

### re_data_z_score
Computed z_score for metric. `re_data` looks back on what where metrics values in last 30 days and compute z_score for newest value.

```sql title="re_data_z_score"
                id                |               table_name               | column_name |    metric     |    z_score_value    |    last_value     |      last_avg      |    last_stddev     |   time_window_end   | interval_length_sec |        computed_on
----------------------------------+----------------------------------------+-------------+---------------+---------------------+-------------------+--------------------+--------------------+---------------------+---------------------+----------------------------
 f19be3406e37defc007e6f24ff25e5b5 | "postgres"."toy_shop"."orders_per_age" | amount      | min           |  0.2214037213556089 |                51 | 50.833333333333336 |  0.752772652709081 | 2021-01-07 00:00:00 |               86400 | 2022-01-20 13:52:05.820813
 8023fc1960181e10b3116d2df757e550 | "postgres"."toy_shop"."orders_per_age" | amount      | max           | -2.0412414521526485 |               197 |              199.5 |  1.224744871391589 | 2021-01-07 00:00:00 |               86400 | 2022-01-20 13:52:05.820813
 7074d2eb212a05eb6f8762221501f9ed | "postgres"."toy_shop"."orders_per_age" | amount      | avg           | -0.9565569719919818 |          123.1625 | 125.10441589695779 | 2.0301100234711553 | 2021-01-07 00:00:00 |               86400 | 2022-01-20 13:52:05.820813
 ee322e502d1cb8d9dbf7375114f6854e | "postgres"."toy_shop"."orders_per_age" | amount      | stddev        | -1.5344203467771198 | 41.82321095806451 |  42.98880644751242 | 0.7596324512658293 | 2021-01-07 00:00:00 |               86400 | 2022-01-20 13:52:05.820813
 4e68493c3cf5d0390374770f9729d645 | "postgres"."toy_shop"."orders_per_age" | amount      | nulls_percent |                   0 |                 0 |                  0 |                  0 | 2021-01-07 00:00:00 |               86400 | 2022-01-20 13:52:05.820813
```

### re_data_anomalies
View computed on top of `re_data_z_score` table to contain metrics that look alerting. Alerting threshold is controlled by var `re_data:alerting_z_score`
which is equal to 3 by default, but can be changed and adjusted.

```sql title="re_data_anomalies"
               id                |               table_name               | column_name |    metric     |    z_score_value    |     last_value     |      last_avg       |     last_stddev     |   time_window_end   | interval_length_sec |        computed_on         |
----------------------------------+----------------------------------------+-------------+---------------+---------------------+--------------------+---------------------+---------------------+---------------------+---------------------+----------------------------+----
 6098a342fe83399b695208112a97cb34 | "postgres"."toy_shop"."order_items"    |             | freshness     |  3.0867937457815877 |               2048 |  422.89473684210526 |   526.4703109426908 | 2021-01-20 00:00:00 |               86400 | 2022-01-20 13:54:56.63893  | fre
 17a28b0294c10e7f2e2f882e7b6f790c | "postgres"."toy_shop"."pending_orders" |             | freshness     |  3.5280241130823335 |              15951 |  3270.2380952380954 |  3594.2957015910906 | 2021-01-22 00:00:00 |               86400 | 2022-01-20 13:55:26.320726 | fre
 a1aa9974176c90468c641cf47683d613 | "postgres"."toy_shop"."orders_per_age" | status      | min_length    |    -4.2485291562996 |                  2 |                 3.9 | 0.44721359549995787 | 2021-01-21 00:00:00 |               86400 | 2022-01-20 13:55:11.294556 | min
 82c65b49c56403cde1a8423fc7ace1bf | "postgres"."toy_shop"."orders_per_age" | amount      | nulls_percent |   4.248529154190601 | 0.6211180124223602 | 0.03105590062111801 |  0.1388862097825956 | 2021-01-21 00:00:00 |               86400 | 2022-01-20 13:55:11.294556 | nul
 08587b89627fb1562bcf49fa2e72d881 | "postgres"."toy_shop"."customers"      | age         | min           | -3.4050793706927704 |                  0 |                20.9 |   6.137889230877852 | 2021-01-21 00:00:00 |               86400 | 2022-01-20 13:55:11.294556 | min
```

### re_data_alerts
View with all alerts (anomalies & schema changes) formatted the same way as in re_data UI. 

```sql title="re_data_alerts"
     type      |                    model                     |                              message                               |   value    |      time_window_end
---------------+----------------------------------------------+--------------------------------------------------------------------+------------+----------------------------
 anomaly       | postgres.toy_shop_sources.toy_shop_customers | avg(age) is 44.06% less than average.                              | 22.89      | 2021-01-21 00:00:00
 anomaly       | postgres.toy_shop_sources.toy_shop_customers | stddev(age) is 54.45% greater than average.                        | 22.21      | 2021-01-21 00:00:00
 anomaly       | postgres.toy_shop.customers                  | min_length(first_name) is 31.58% greater than average.             | 4.00       | 2021-01-26 00:00:00
 anomaly       | postgres.toy_shop_sources.toy_shop_customers | min_length(first_name) is 31.58% greater than average.             | 4.00       | 2021-01-26 00:00:00
 anomaly       | postgres.toy_shop_sources.toy_shop_customers | freshness is 285.20% greater than average.                         | 7.97 hours | 2021-01-23 00:00:00
 anomaly       | postgres.toy_shop.customers                  | freshness is 285.20% greater than average.                         | 7.97 hours | 2021-01-23 00:00:00
 schema_change | postgres.toy_shop_sources.toy_shop_customers | column last_name of type text was added.                           |            | 2022-01-20 11:53:01.779986
 schema_change | postgres.toy_shop_sources.toy_shop_customers | column first_name of type text was added.                          |            | 2022-01-20 11:53:01.779986
 ```

### re_data_test_history
A table containing all test results monitored by re_data.

```sql title="re_data_test_history" 
        table_name        | column_name |                                 test_name                                  | status |       run_at
--------------------------+-------------+----------------------------------------------------------------------------+--------+---------------------
 postgres.toy_shop.orders | amount      | not_null_orders_amount                                                     | Fail   | 2022-01-13 08:49:39
 postgres.toy_shop.orders | status      | accepted_values_orders_status__pending__shipped__delivered__not_paid__paid | Fail   | 2022-01-13 08:49:39
 postgres.toy_shop.orders | customer_id | not_null_orders_customer_id                                                | Pass   | 2022-01-13 08:49:39
 postgres.toy_shop.orders | created_at  | not_null_orders_created_at                                                 | Pass   | 2022-01-13 08:49:39
 postgres.toy_shop.orders | status      | not_null_orders_status                                                     | Pass   | 2022-01-13 08:49:39
```

:::caution
Some of re_data models will be subject to change in the future, if you are writing code that depends on those models consider joining our [Slack](https://www.getre.io/slack) and letting us know. We should be able to tell a bit more about what/when etc. may change and what to expect from the future releases.
:::