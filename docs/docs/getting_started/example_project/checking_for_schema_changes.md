---
sidebar_position: 6
---

# Checking for schema changes

Now we will tests one more aspect of re_data, detecting schema changes. Let's simulate a change in one of the toy_shop tables.

```
alter table toy_shop.customers add column my_new_column integer;
```

And now, we will run re_data again, but this time we will only compute models related to schema changes. Because of that, we don't need to pass time parameters as detecting schema changes doesn't need them. We use the `+` sign to compute all required ancestors of `re_data_schema_changes` model.

```
dbt run --models +re_data_schema_changes
```

:::info

As computing a single model is definitely possible in `re_data`, make sure you are also computing all model's ancestors, otherwise, sometimes models can just not refresh and not contain new data.
:::


Here is what our table will look like after this run:
```sql
postgres=> select table_name, operation, column_name, data_type, is_nullable, prev_column_name, prev_data_type, prev_is_nullable  from toy_shop_re.re_data_schema_changes ;
            table_name             |  operation   |  column_name  | data_type | is_nullable | prev_column_name | prev_data_type | prev_is_nullable
-----------------------------------+--------------+---------------+-----------+-------------+------------------+----------------+------------------
 "postgres"."toy_shop"."customers" | column_added | my_new_column | integer   | t           |                  |                |
```


We can see, `my_new_column` added here with the type and nullability of it. In case of a removed or modified column, `prev*` fields will contain information about the previous type of column.

You can integrate re_data metrics any way you want with your current BI tools. And of course, re_data can be run from a command line by Airflow or another scheduling tool.

## Next steps

:::tip
**Congrats** on finishing our tutorial! We hope it was useful for you! 🙂
:::

There are couple ways you can integrate re_data into your dbt project.

When using apache Airflow as you job scheduler, it's recommended to run
and compute `re_data` after your main dbt project. 
You can use both `re_data` package or just plain `dbt` for computing re_data models.

If you want to talk more about your setup, features to add or just say hi! We encourage you to join as on [Slack!](https://www.re-data.io/slack) 😊