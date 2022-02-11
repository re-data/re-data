---
sidebar_position: 1
---

# Tests history

re_data adds dbt macros which make it possible to save test history to your data warehouse & later on investigate them with our reliability UI.

## on-run-end
To start saving tests you just need to call re_data `save_test_history` macro in `on-run-end` hook. You can do it by adding the code below into your `dbt_project.yml`. In case of having some other hooks existing already you just need to add this as an item into the list.

```yml dbt_project.yml

on-run-end:
  - "{{ re_data.save_test_history(results) }}"

```

:::caution
on-run-end hooks are called for dbt tests since dbt 1.0.0, so this re_data feature is only available with the new dbt version.
:::


## re_data_test_history

re_data test history model contains information about tests and their stats.


```sql
select * from toy_shop_re.re_data_test_history
        table_name        | column_name |                                 test_name                                  | status |       run_at
--------------------------+-------------+----------------------------------------------------------------------------+--------+---------------------
 postgres.toy_shop.orders | amount      | not_null_orders_amount                                                     | Fail   | 2022-01-13 08:49:39
 postgres.toy_shop.orders | status      | accepted_values_orders_status__pending__shipped__delivered__not_paid__paid | Fail   | 2022-01-13 08:49:39
 postgres.toy_shop.orders | customer_id | not_null_orders_customer_id                                                | Pass   | 2022-01-13 08:49:39
 postgres.toy_shop.orders | created_at  | not_null_orders_created_at                                                 | Pass   | 2022-01-13 08:49:39
 postgres.toy_shop.orders | status      | not_null_orders_status                                                     | Pass   | 2022-01-13 08:49:39
```

## Tests view

Tests view lets you see the history of all dbt tests run. You can filter on the table, time, etc.

![GraphExample](/screenshots/ui/tests.png)


