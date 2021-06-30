### Welcome to toy shop! :)

This is example project for re_data tutorial

Toy shop is fictional e-commerce shop (selling toys:) It's example of how re_data project can work and help you improve data in your data warehouse.

Toy shop DB has currently just 3 tables:
 - customers
 - orders
 - order_items

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

You can find toy shop data here. Toy shop started operating on 1 January 2021.

### Create re_data project

Currently it's doing ok, but want to know something more than that from 
data they are collecting. First we install re_data into our python environment.

```
pip install re_data
```

Then we crate project to analyze toy shop data, fallowing command will
create `toy_shop_analysis` directory in current folder.

```
re_data init toy_shop_analysis
```

With `re_data` and `dbt` your analysis can and if possible should be done in git repository. We will not mention git commands to add created files to git, but we highly recommend it.

### Connecting to data warehouse 

Not it's time to inspect what tables we have in our data warehouse.

To run inspection, we will need to first point `re_data` to tables in  data warehouse. We go into `dbt_project.yml` file in newly created created directory and
fill in the line like that

```
    re_data:schemas:
        - toy_shop
```

All data we are intersted in is in `toy_shop` table schema, it would be possible to pass couple schemas here.

Ok. now we want to run `re_data` for first time, for now just to detect tables we 
in our data warehouse. We run following command.

```
re_data detect
```

Assuming run is successfull we go to our data warehouse and look for schema `toy_shop_analysis` (this is schema we passed to in `~/.dbt/profiles.yml`)

There should be 2 tables created in you data warehouse:
```
toy_shop_analysis.re_data_columns  toy_shop_analysis.re_data_tables
```

`re_data_tables` tables will have output similar to this:
```
        table_name        | time_filter | actively_monitored |       detected_time
--------------------------+-------------+--------------------+----------------------------
 "toy_shop"."customers"   | joined_at   | f                  | 2021-06-30 15:11:07.697005
 "toy_shop"."order_items" | added_at    | f                  | 2021-06-30 15:11:07.697005
 "toy_shop"."orders"      | created_at  | f                  | 2021-06-30 15:11:07.697005
```

What we want to do is to start monitoring our tables, we simply do update with SQL:

```
update toy_shop_analysis.re_data_tables set actively_monitored = true;
```

No as we done it we our re_data run will compute metrics for all those tables.
Let's run it, for now just for first day of toy shop activity

```
re_data run --start-date 2021-01-01 --end-date 2021-01-02
```

Assuming run was succesfull we should see bunch of new tables added to our DB
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
added in on 01-01-2021

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

Ok, but now important now, briefly looking first day data seems reasons.
But do all of days seems like that, lets compute those metrics for whole last month

```
re_data run --start-date 2021-01-02 --end-date 2021-01-30
```

