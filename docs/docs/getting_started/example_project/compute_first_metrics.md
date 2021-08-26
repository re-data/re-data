---
sidebar_position: 4
---

# Compute first metrics

Now lets compute first metircs. On the start we want to turn on monitoring for all detected tables:

We do this just be running SQL:

```sql
update toy_shop_re.re_data_tables set actively_monitored = true;
```

Then we run monitoring, we choose to run it for first day of the 2021:


```bash
dbt run --models package:re_data --vars \
   '{
     "re_data:time_window_start": "2021-01-01 00:00:00",
     "re_data:time_window_end": "2021-01-02 00:00:00"
    }'
```


All of those contain metrics of our 3 tables. Let's just see how many orders/customers we have added in on 01-01-2021.

```sql
postgres=> select * from toy_shop_re.re_data_row_count ;
               table_name               | column_name |  metric   | value |  time_window_start  |   time_window_end
----------------------------------------+-------------+-----------+-------+---------------------+---------------------
 "postgres"."toy_shop"."customers"      |             | row_count |    15 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
 "postgres"."toy_shop"."order_items"    |             | row_count |    48 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
 "postgres"."toy_shop"."orders"         |             | row_count |    20 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
```

We can of course inspect any of those metrics and it maybe also really usefull to write dbt tests for values we expect in those.

But now let's focus on finding out if there are any anomalies in our data.