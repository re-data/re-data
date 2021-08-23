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
                id                |               table_name               | time_filter | actively_monitored |       detected_time
----------------------------------+----------------------------------------+-------------+--------------------+----------------------------
 d23caf4811ca9a4086a916478fa937c5 | "postgres"."toy_shop"."customers"      | joined_at   | t                  | 2021-08-19 08:52:15.517444
 51dbd8444cd98a54b2752f57feea9b6f | "postgres"."toy_shop"."order_items"    | added_at    | t                  | 2021-08-19 08:52:15.517444
 8569c11831706d0b0e580b2b2f7321df | "postgres"."toy_shop"."orders"         | created_at  | t                  | 2021-08-19 08:52:15.517444
 b432568ba92a2c6f0f26f63801dc7eca | "postgres"."toy_shop"."pending_orders" | created_at  | t                  | 2021-08-19 08:52:15.517444
```

Notice, re_data guessed time_filter column for all the tables. This column will enable us to filter and collect time based metrics. We could have changed it if it wasn't guessed properly by updating `toy_shop_re.re_data_tables` `time_filter` column.


