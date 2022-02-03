---
sidebar_position: 1
---

# Welcome to a toy shop!

Welcome to a re_data getting started tutorial. We will prepare, analyze and monitor toy shop data here. The toy shop is a fictional e-commerce shop 🙂

It's an example of how a re_data project can work and help you improve data in your data warehouse


## Checking out the toy shop

To run re_data for toy_shop yourself, clone our repo: https://github.com/re-data/re-data and `cd` to toy shop project.

```bash
git clone https://github.com/re-data/re-data
cd re-data/getting_started/toy_shop/
```

## Toy shop data
Toy shop DB has 4 source & seed tables which we would like to observe:
  - customers
  - orders
  - order_items
  - companies

And some other dbt models we would like to observe too:

- pending_orders
- orders_per_age
- revenue_per_age

You can check them in `models` and `seeds` folders for more details.

:::info
We use seeds instead of sources much more often than you would normally do in dbt. We do just out of easiness of setup which dbt gives for them.
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

```
dbt seed
dbt run-operation create_toy_shop_source_tables
dbt run --exclude package:re_data
```
