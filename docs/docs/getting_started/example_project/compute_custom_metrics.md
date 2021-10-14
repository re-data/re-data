---
sidebar_position: 5
---

# Specifying custom metrics

Now, let's focus on some metrics which will be specific for us. Let's start with a very simple metric. We would like to know how many our orders are above 300$.

We create an new file for our metrics in our macros folder and create macro definition:

```sql title="macros/my_metrics.sql"
{% macro re_data_metric_large_orders(context) %}
    coalesce(
      sum(
          case when amount > 300
            then 1
          else 0
          end
      ), 0
    )
{% endmacro %}
```

And now let's just add this configuration to orders table in `dbt_project.yml`

```yml title="dbt_project.yml vars"
vars:
  re_data:monitored:
    - tables:
      - name: orders
        time_filter: created_at
        actively_monitored: true
        
        metrics:
          - large_orders
```

And run re_data again..

```bash
dbt run --models package:re_data --vars \
   '{
     "re_data:time_window_start": "2021-01-01 00:00:00",
     "re_data:time_window_end": "2021-01-02 00:00:00"
    }'
```

Let's check who the metric computed:

```sql
select table_name, column_name, metric, value, time_window_start, time_window_end  from toy_shop_re.re_data_metrics where metric = 'large_orders';

           table_name           | column_name |    metric    | value |  time_window_start  |   time_window_end
--------------------------------+-------------+--------------+-------+---------------------+---------------------
 "postgres"."toy_shop"."orders" |             | large_orders |     4 | 2021-01-01 00:00:00 | 2021-01-02 00:00:00
```

Ok, we managed to compute our first custom metric! :data:


One thing you probably noticed is custom metric is just an expression.
This makes it possible for re_data to compute many metrics in one query.
But if you need to do a separate query to compute a metric it's still possible.

If you are interested how they should look, check out `re_data` **[unique_rows metric](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.re_data_metric_unique_rows)**. 

Notice writing custom metrics which are doing subqueries is more advanced feature of re_data, so if you found yourself doing that it maybe good for you to join our  **[Slack! 😊](https://join.slack.com/t/re-data/shared_invite/zt-vkauq1y8-tL4R4_H5nZoVvyXyy0hdug)**


And now once, let's move to another interesting topic: anomalies!

