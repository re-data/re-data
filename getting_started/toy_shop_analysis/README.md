## Getting started tutorial

Welcome to a re_data getting started tutorial.
We will analyze and monitor toy shop data here.
The toy shop is a fictional e-commerce shop 🙂
It's an example of how a re_data project can work and help you improve data in your data warehouse.\

### Toy shop

Toy shop DB has currently just 3 tables:
 - customers
 - orders
 - order_items

```
                        Table "toy_shop.customers"
   Column   |            Type             | Collation | Nullable | Default
------------+-----------------------------+-----------+----------+---------
 id         | integer                     |           |          |
 first_name | text                        |           |          |
 last_name  | text                        |           |          |
 age        | integer                     |           |          |
 joined_at  | timestamp without time zone |           |          |

                           Table "toy_shop.orders"
   Column    |            Type             | Collation | Nullable | Default
-------------+-----------------------------+-----------+----------+---------
 id          | integer                     |           |          |
 customer_id | integer                     |           |          |
 amount      | integer                     |           |          |
 status      | text                        |           |          |
 created_at  | timestamp without time zone |           |          |

                      Table "toy_shop.order_items"
  Column  |            Type             | Collation | Nullable | Default
----------+-----------------------------+-----------+----------+---------
 item_id  | integer                     |           |          |
 order_id | integer                     |           |          |
 name     | text                        |           |          |
 amount   | integer                     |           |          |
 added_at | timestamp without time zone |           |          |
```


You can find toy shop data here: [link](https://github.com/re-data/re-data/tree/feature/version-0.1.3/getting_started/toy_shop/data). Toy shop started operating on 1 January 2021.

Toy shop data is stored in Postgres (re_data also works with BigQuery, Snowflake & Redshift)

### Create re_data project

First, we install re_data into our python environment.

```
pip install re_data
```

Then we create the project to analyze toy shop data, following command will create a `toy_shop_analysis` directory in the current folder.

```
re_data init toy_shop_analysis
```

### Connecting to data warehouse 

As a  re_data project is also a dbt project as well we can connect the same way.
We for now will use dbt cli so that docs for setup can be found here: https://docs.getdbt.com/dbt-cli/configure-your-profile

For postgres we specify this, on our `~/.dbt/profiles.yml` files
```
toy_shop_analysis:
  target: dev
  outputs:
    dev:
      type: postgres
      host: xxx
      user: xxx
      password: xxx
      port: 5432
      dbname: xxx
      schema: toy_shop_analysis
      threads: 4
```

And to use this configuration we add this line to the `dbt_project.yml` file in a directory created by re_data.

```
profile: 'toy_shop_analysis'
```

Notice we use `toy_shop_analysis` as profile name as well as a schema in db connection. All tables created will have this schema.

### Setup

Now it's time to inspect what tables we have in our data warehouse and decide how we would like to observe them.

To run inspection, we will need to first point `re_data` to a schema where we have our tables. We go once again into the `dbt_project.yml` file fill in vars configuration:

```
    re_data:schemas:
        - toy_shop
```

Data we are interested in is in the `toy_shop` table schema.
Now we want to run `re_data` for the first time, for now just to detect tables. We run the following command.

```
re_data detect
```

Assuming the run is successful we go to our data warehouse and look for schema `toy_shop_analysis` 

There should be 2 tables created in your data warehouse:
```
toy_shop_analysis.re_data_columns  toy_shop_analysis.re_data_tables
```

`re_data_tables` tables will have content similar to this:
```
        table_name        | time_filter | actively_monitored |       detected_time
--------------------------+-------------+--------------------+----------------------------
 "toy_shop"."customers"   | joined_at   | f                  | 2021-06-30 15:11:07.697005
 "toy_shop"."order_items" | added_at    | f                  | 2021-06-30 15:11:07.697005
 "toy_shop"."orders"      | created_at  | f                  | 2021-06-30 15:11:07.697005
```

We want to start monitoring all of those tables, we can turn it on with simple SQL:

```
update toy_shop_analysis.re_data_tables set actively_monitored = true;
```

*Notice, re_data guessed time_filter column for all the tables. This column will enable us to filter and collect daily metrics. We could have changed it if it wasn't guessed properly by updating `toy_shop_analysis.re_data_tables` time_filter column.*

### Computing metrics for tables

Let's run re_data, for now just for the first day of toy shop activity.

```
re_data run --start-date 2021-01-01 --end-date 2021-01-02
```

Assuming the run was successful we should see a bunch of new tables (and views) added to our DB.

```
toy_shop_analysis.re_data_alerting       toy_shop_analysis.re_data_last_metrics
toy_shop_analysis.re_data_avg            toy_shop_analysis.re_data_last_stats
toy_shop_analysis.re_data_avg_length     toy_shop_analysis.re_data_max
toy_shop_analysis.re_data_base_metrics   toy_shop_analysis.re_data_max_length
toy_shop_analysis.re_data_columns        toy_shop_analysis.re_data_min
toy_shop_analysis.re_data_count_missing  toy_shop_analysis.re_data_min_length
toy_shop_analysis.re_data_count_nulls    toy_shop_analysis.re_data_row_count
toy_shop_analysis.re_data_freshness      toy_shop_analysis.re_data_tables
toy_shop_analysis.re_data_freshness_inc  toy_shop_analysis.re_data_z_score
```

All of those contain metrics of our 3 tables. Let's just see how many orders/customers we have 
added in on 01-01-2021.

```
// select table_name, metric, value from toy_shop_analysis.re_data_row_count ;
        table_name        |  metric   | value
--------------------------+-----------+-------
 "toy_shop"."customers"   | row_count |    15
 "toy_shop"."order_items" | row_count |    48
 "toy_shop"."orders"      | row_count |    20
```

We can of course inspect any of those metrics for example maximal values showing up in columns:

```
select table_name, column_name, metric, value from toy_shop_analysis.re_data_max;
        table_name        | column_name | metric | value
--------------------------+-------------+--------+-------
 "toy_shop"."customers"   | id          | max    |   490
 "toy_shop"."customers"   | age         | max    |    43
 "toy_shop"."order_items" | order_id    | max    |   728
 "toy_shop"."order_items" | item_id     | max    |  1858
 "toy_shop"."order_items" | amount      | max    |     3
 "toy_shop"."orders"      | amount      | max    |   393
 "toy_shop"."orders"      | id          | max    |   728
 "toy_shop"."orders"      | customer_id | max    |   490
```


It may be really useful to create tests for those values being in certain ranges etc. (We will do it in another tutorial)

### Checking for anomalies

But for now, let's compute metrics for the whole of last month and see if re_data will found any anomalies in them.

```
re_data run --start-date 2021-01-02 --end-date 2021-01-30
```

Notice we start counting from the second of January as we don't want to compute new metrics for the January 1st twice.

Assuming this completed successfully lets query alerts table:

```
select * from toy_shop_analysis.re_data_alerting
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

We can see a couple of alerting things here (some things look like false alerts, but most seem to be real problems with data).
For example for this:

```
        table_name        | column_name |  metric   |    z_score_value    | last_value |      last_avg      |   time_window_end
--------------------------+-------------+-----------+---------------------+------------+--------------------+---------------------
 "toy_shop"."order_items" |             | row_count | -3.0530445968041606 |          0 |  59.47826086956522 | 2021-01-24 00:00:00
 "toy_shop"."orders"      |             | row_count | -3.2576351652461364 |          0 | 23.608695652173914 | 2021-01-24 00:00:00
 ```

 It seems on 2021-01-23 we didn't get any orders and with an average above 23 orders per day that seems really odd.

 We are also seeing alerting values of nulls in customers `first_name`, `last_name`, `age` at the end of the month:

 ```
 "toy_shop"."customers"   | first_name  | count_nulls   |   5.003702330376757 |          1 | 0.037037037037037035 | 2021-01-28 00:00:00
 "toy_shop"."customers"   | first_name  | count_missing |   5.003702330376757 |          1 | 0.037037037037037035 | 2021-01-28 00:00:00
 "toy_shop"."customers"   | id          | count_nulls   |   5.003702330376757 |          1 | 0.037037037037037035 | 2021-01-28 00:00:00
 "toy_shop"."customers"   | age         | count_nulls   |   5.003702330376757 |          1 | 0.037037037037037035 | 2021-01-28 00:00:00
 "toy_shop"."customers"   | last_name   | count_nulls   |   5.003702330376757 |          1 | 0.037037037037037035 | 2021-01-28 00:00:00
 "toy_shop"."customers"   | last_name   | count_missing |   5.003702330376757 |          1 | 0.037037037037037035 | 2021-01-28 00:00:00
 "toy_shop"."customers"   | first_name  | min_length    |   5.102520382924569 |          4 |   3.0357142857142856 | 2021-01-29 00:00:00
 ```

For now, that's it :) you can use the `re_data_alerting` table as a warning generator that something is not right with your data.
You can also integrate re_data metrics any way you want with your current BI tools.
And of course, re_data can be run from a command line by Airflow or another scheduling tool.

Congrats on finishing our tutorial! We hope it was useful for you! 🙂

### What do you think?

Let us know your thoughts on [Slack!](https://www.re-data.io/slack)
