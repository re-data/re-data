---
sidebar_position: 2
---

# Loading data

If you would like to load toy_shop data to some of your testing DBs, clone our repo: https://github.com/re-data/re-data and `cd` to toy shop project.

```bash
git clone https://github.com/re-data/re-data
cd re-data/getting_started/toy_shop/
```

For toy_shop to work you will need dbt connection with name `toy_shop` to some your test DB.

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

Make sure you can use schema: toy_shop in your DB.

Now you are ready to load load data, you can do it with running:

```
dbt seed
```
