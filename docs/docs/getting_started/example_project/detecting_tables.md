---
sidebar_position: 3
---

# Detecting tables

Now we will create re_data tables which will track metrics from toy_shop tables:

We update vars in our `dbt_project.yml` with schema to monitor.

```yml title="dbt_project.yml vars"
vars:
  re_data:alerting_z_score: 3
  re_data:schemas:
    - toy_shop 
```

And now we can run dbt of project for the first time:

```bash
dbt run --models +re_data_tables
```

For now we only compute tables related to metadata not health metrics about your data.

There should be 2 tables created in your data warehouse (under project_name_re schema)

```sql
toy_shop_re.re_data_columns  toy_shop_re.re_data_tables
```

`re_data_tables` tables will have content similar to this:


```sql
postgres=> select * from toy_shop_re.re_data_tables ;
         table_name          | time_filter | actively_monitored |       detected_time
-----------------------------+-------------+--------------------+----------------------------
 "toy_shop"."customers"      | joined_at   | f                  | 2021-07-12 08:11:14.327034
 "toy_shop"."order_items"    | added_at    | f                  | 2021-07-12 08:11:14.327034
 "toy_shop"."orders"         | created_at  | f                  | 2021-07-12 08:11:14.327034
```

Notice, re_data guessed time_filter column for all the tables. This column will enable us to filter and collect time based metrics. We could have changed it if it wasn't guessed properly by updating `toy_shop_re.re_data_tables` `time_filter` column.


