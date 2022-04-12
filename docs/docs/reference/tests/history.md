---
sidebar_position: 2
---

# Tests history

re_data can store dbt tests history into your data warehouse and visualize details of it in re_data UI.

## Config

re_data comes with 3 config options to configure:
#### `re_data:save_test_history` (default false) 
by default re_data doesn't store tests history to enable this you would need to set this var to `true`

#### `re_data:test_history_failures` (default true) 
tells re_data if it should query for test failures and store them in db. It's enable by default

#### `test_history_failures_limit` (default 10)
since failures can be quite big and often similar to each other we don't advise to store all of them in db but to add some limit on number of them stored.

Example test history configuration:

```yml dbt_project.yml
vars:
  re_data:save_test_history: true
  re_data:test_history_failures: true
  re_data:test_history_failures_limit: 10
```

:::caution
re_data uses on-run-end hooks for dbt tests to save the tests data. This is only available in dbt versions 1.0.0 or newer.
:::

## Tests view

Tests view lets you see the history of all dbt tests run. You can filter on the table, time, etc.

![GraphExample](/screenshots/ui/tests.png)

## Test details

Tests detail view lets you see the history of a single tests over time. It shows number of failures, SQL code run and failure rows.

![GraphExample](/screenshots/ui/tests.png)

:::info
To see failing rows from tests you would need to run dbt test with `--store-failures` config option.
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
