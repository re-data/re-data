---
sidebar_position: 2
---

# Reliability data

Now, let's compute the first health data. We will use the re_data configuration already defined in the project.

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

```sql
# Anytime re_data computes its models, it detects tables being monitored and their configuration and stores them
postgres=> SELECT * FROM toy_shop_re.re_data_monitored;

            name             |  schema  | database | time_filter  | metrics | columns |                anomaly_detector
-----------------------------+----------+----------+--------------+---------+---------+------------------------------------------------
 pending_orders_per_customer | toy_shop | postgres | time_created | {}      | []      | {"name": "z_score", "threshold": 2.2}
 customers                   | toy_shop | postgres |              | {}      | []      | {"name": "modified_z_score", "threshold": 3}
 orders                      | toy_shop | postgres | time_created | {}      | []      | {"name": "modified_z_score", "threshold": 3.5}
```

You would notice the anomaly_detector is specified at different [configuration](/docs/reference/config) levels
```yaml
# toy_shop/seeds/schema.yml
- name: orders
  config:
    re_data_monitored: true
    re_data_time_filter: time_created
    re_data_anomaly_detector:
      name: modified_z_score
      threshold: 3.5

# toy_shop/models/pending_orders_per_customer.sql
{{
    config(
        re_data_monitored=true,
        re_data_time_filter='time_created',
        re_data_anomaly_detector={'name': 'z_score', 'threshold': 2.2},
    )
}}

# customers table has no specified anomaly configuaration so it defaults to the re_data provided configuration.
```
Metrics have been computed for the window between 2021-01-01 and 2021-01-02, let us see how many rows we have for the tables being monitored. The `row_count` metric gives us that.
:::info
Note, if a model being monitored has no time filter specified, re_data will compute the metric over the whole table.
A `global__` prefix would be added to the metric.
:::
```sql title="Viewing computed metrics"
postgres=> SELECT table_name, metric, value, time_window_start, time_window_end from toy_shop_re.re_data_metrics where metric in( 'row_count', 'global__row_count');

                     table_name                      |      metric       | value |  time_window_start  |   time_window_end
-----------------------------------------------------+-------------------+-------+---------------------+---------------------
 "postgres"."toy_shop"."customers"                   | global__row_count |    15 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
 "postgres"."toy_shop"."orders"                      | row_count         |    20 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
 "postgres"."toy_shop"."pending_orders_per_customer" | row_count         |     5 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
```

## re_data run for ten first days of January

On production, we would set up re_data to run daily/hourly/etc. For toy shop, by using the re_data python package command we backfill daily data for the past.

```
re_data run --start-date 2021-01-01 --end-date 2021-01-11
```

## Looking into anomalies

And now let's look into the `re_data_anomalies` table to see if `re_data` found anything suspicious for us:


```sql title="Viewing computed anomalies"
postgres=> select table_name, metric, z_score_value, modified_z_score_value, last_value, time_window_end from toy_shop_re.re_data_anomalies;

                     table_name                      |   metric   |  z_score_value   | modified_z_score_value |    last_value    |   time_window_end
-----------------------------------------------------+------------+------------------+------------------------+------------------+---------------------
 "postgres"."toy_shop"."orders"                      | stddev     | 2.26512659456492 |       33.1559468401042 | 76623.0542133031 | 2021-01-08 00:00:00
 "postgres"."toy_shop"."orders"                      | max        | 1.90332380570845 |       5.39599999982013 |              220 | 2021-01-08 00:00:00
 "postgres"."toy_shop"."orders"                      | avg        | 2.23609834440421 |       12.5165457875454 | 83714.2857142857 | 2021-01-08 00:00:00
 "postgres"."toy_shop"."orders"                      | variance   | 2.17679662067361 |       14.3162734688659 | 5933.28235294118 | 2021-01-08 00:00:00
 "postgres"."toy_shop"."orders"                      | avg_length | 1.99359828729157 |       4.83162244794424 | 12.1428571428571 | 2021-01-08 00:00:00
 "postgres"."toy_shop"."orders"                      | stddev     | 2.12566830905018 |       12.0321401712802 | 77.0278024672986 | 2021-01-08 00:00:00
 "postgres"."toy_shop"."orders"                      | row_count  | 1.97360659802582 |       5.05874999974706 |               35 | 2021-01-08 00:00:00
 "postgres"."toy_shop"."orders"                      | variance   | 2.26750636806239 |       96.2432445786529 | 5871092436.97479 | 2021-01-08 00:00:00
 "postgres"."toy_shop"."pending_orders_per_customer" | avg        | 2.23118408449371 |       11.0541393078969 | 114782.608695652 | 2021-01-08 00:00:00
 "postgres"."toy_shop"."pending_orders_per_customer" | max        | 2.25075673466898 |       27.6544999999994 |           250000 | 2021-01-08 00:00:00
 ```

We can see there are a couple of things re_data flagged for us. Recall that re_data would flag anomalies based on the method of detection and the threshold set.

## Running tests

Before moving on and investigating it in re_data UI. Let's run tests to see if they point to any problems in our data.

First we update the dbt_project.yml file to add an [on-run-end](https://docs.getdbt.com/reference/project-configs/on-run-start-on-run-end) hook. This macro provided makes it possible to save test history to your database on each test run.

:::caution
on-run-end hooks are called for dbt tests since dbt 1.0.0, so this re_data feature is only available for dbt versions >= 1.0.0.
:::

```yaml title="toy_shop/dbt_project.yml"
on-run-end:
  - "{{ re_data.save_test_history(results) }}"
```


```bash title="Running tests"
$ dbt test --select package:toy_shop

...

22:36:20  1 of 7 START test accepted_values_orders_status__PENDING_PAYMENT__PAID__SHIPPED__DELIVERED [RUN]
22:36:20  2 of 7 START test not_null_customers_id......................................... [RUN]
22:36:20  3 of 7 START test not_null_orders_amount........................................ [RUN]
22:36:20  4 of 7 START test not_null_orders_customer_id................................... [RUN]
22:36:21  2 of 7 PASS not_null_customers_id............................................... [PASS in 0.12s]
22:36:21  3 of 7 PASS not_null_orders_amount.............................................. [PASS in 0.13s]
22:36:21  4 of 7 PASS not_null_orders_customer_id......................................... [PASS in 0.13s]
22:36:21  1 of 7 PASS accepted_values_orders_status__PENDING_PAYMENT__PAID__SHIPPED__DELIVERED [PASS in 0.13s]
22:36:21  5 of 7 START test not_null_orders_status........................................ [RUN]
22:36:21  6 of 7 START test not_null_orders_time_created.................................. [RUN]
22:36:21  7 of 7 START test unique_customers_id........................................... [RUN]
22:36:21  5 of 7 PASS not_null_orders_status.............................................. [PASS in 0.05s]
22:36:21  6 of 7 PASS not_null_orders_time_created........................................ [PASS in 0.05s]
22:36:21  7 of 7 PASS unique_customers_id................................................. [PASS in 0.05s]
22:36:21  
22:36:21  Finished running 7 tests in 0.56s.
22:36:21  
22:36:21  Completed successfully
22:36:21  
22:36:21  Done. PASS=7 WARN=0 ERROR=0 SKIP=0 TOTAL=7

```


Ok, so some of the tests are failing. At least they should fail for you ... 😊

Let's move to the next chapter and investigate what's going on.