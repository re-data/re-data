---
sidebar_position: 1
---

# Welcome to toy shop!

Welcome to a re_data getting started tutorial. We will prepare, analyze and monitor toy shop data here. The toy shop is a fictional e-commerce shop 🙂

It's an example of how a re_data project can work and help you improve data in your data warehouse


## Setting up toy shop project
Install re_data if you don't have it already
```bash
pip install re_data
```

Set up a dbt project containing the toy shop data using the re_data CLI.

```bash
re_data init toy_shop
cd toy_shop/
```

## Toy shop data
You would observe that the project has two seed files included and we are going to use re_data to monitor these tables
  - toy_shop/seeds/customers.csv
  - toy_shop/seeds/orders.csv

The project also contains a model which can be monitored with re_data as well
- toy_shop/models/pending_orders_per_customer.sql

:::info
We use seeds instead of sources much more often than you would normally do in dbt. This is due to the convenient setup dbt offers for seeds
:::

## Profile setup

For re_data to work you will need dbt connection with name `toy_shop` to some test DB. Here is example of how it would look like for postgres, if need more details on that check out dbt **[docs.](https://docs.getdbt.com/reference/profiles.yml)**

```yml title=~/.dbt/profiles.yml
toy_shop:
  target: dev
  outputs:
    dev:
      type: postgres
      host: xxx
      user: xxx
      password: xxx
      port: 5432
      dbname: xxx
      schema: toy_shop
      threads: 4
```

## Loading data & creating models

Now you are ready to load toy_shop seed data & create project models. Notice we exclude re_data from being run now, as we will want to run it in a separate process.

```yaml
# load seed files into the database
dbt seed
# Set up the models of toy_shop only, pending_orders_per_customer in this case.
dbt run --exclude package:re_data
```

```sql title="Loaded data"
toy_shop=> SELECT * FROM toy_shop.orders;
 id  | customer_id |     status      | amount |    time_created
-----+-------------+-----------------+--------+---------------------
   1 |           2 | PAID            |  20000 | 2021-01-02 14:10:54
   2 |           3 | SHIPPED         |  20000 | 2021-01-06 06:39:15
   3 |           4 | DELIVERED       |  40000 | 2021-01-10 20:46:55
   4 |           5 | PENDING_PAYMENT |  20000 | 2021-01-10 12:15:55
   5 |           6 | PAID            |  25000 | 2021-01-09 21:38:54
   ..
   ..
   ..
toy_shop=> SELECT * FROM toy_shop.customers;
 id | age |       name
----+-----+-------------------
  1 |  25 | Matias Douglas
  2 |  38 | Raelyn Harrison
  3 |  34 | Anaya Reed
  4 |  46 | Mario Harris
  5 |  28 | John Roberts
  ..
  ..
  ..
toy_shop=> SELECT * FROM toy_shop.pending_orders_per_customer;
 id  | amount |     status      |    time_created     | customer_id | age
-----+--------+-----------------+---------------------+-------------+-----
   4 |  20000 | PENDING_PAYMENT | 2021-01-10 12:15:55 |           5 |  28
   8 |   5000 | PENDING_PAYMENT | 2021-01-05 11:41:49 |           9 |  60
  12 |  20000 | PENDING_PAYMENT | 2021-01-08 13:10:48 |          13 |  38
  16 |  30000 | PENDING_PAYMENT | 2021-01-05 13:57:46 |           2 |  38
  20 |  30000 | PENDING_PAYMENT | 2021-01-09 20:07:28 |           6 |  39
  24 |  10000 | PENDING_PAYMENT | 2021-01-06 06:42:35 |          10 |  29
  28 |  45000 | PENDING_PAYMENT | 2021-01-02 10:03:27 |          14 |  20
  ..
  ..
  ..
```
