---
sidebar_position: 0
---

# Init

`re_data init` CLI command is used for initialiazing a dbt project from scratch with re_data setup.

## init
```bash
re_data init project_name
```

This creates a folder with a valid dbt project setup. The `name` and `profile` values in the `dbt_project.yml` would use the project_name specified as argument to the command.

The project setup contains two seed files:
  - toy_shop/seeds/customers.csv
  - toy_shop/seeds/orders.csv

And it also contains one model:
- toy_shop/models/pending_orders_per_customer.sql

which is used to showcase a [toy_shop project](/docs/re_data/getting_started/toy_shop/toy_shop_data.mdx) using re_data.