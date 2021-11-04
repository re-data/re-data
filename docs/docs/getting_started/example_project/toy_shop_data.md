---
sidebar_position: 1
---

# Welcome to a toy shop!

Welcome to a re_data getting started tutorial. We will prepare, analyze and monitor toy shop data here. The toy shop is a fictional e-commerce shop 🙂

It's an example of how a re_data project can work and help you improve data in your data warehouse

## Toy shop data
Toy shop DB has currently just 4 tables:
  - customers
  - orders
  - order_items
  - companies
  - user_data
  - us_states

```sql title=toy_shop_schema
                        Table "toy_shop.customers"
   Column   |            Type             | Collation | Nullable | Default
------------+-----------------------------+-----------+----------+---------
 id         | integer                     |           |          |
 first_name | text                        |           |          |
 last_name  | text                        |           |          |
 age        | integer                     |           |          |
 joined_at  | timestamp without time zone |           |          |

                           Table "toy_shop.orders"
   Column    |            Type             | Collation | Nullable | Default
-------------+-----------------------------+-----------+----------+---------
 id          | integer                     |           |          |
 customer_id | integer                     |           |          |
 amount      | integer                     |           |          |
 status      | text                        |           |          |
 created_at  | timestamp without time zone |           |          |

                      Table "toy_shop.order_items"
  Column  |            Type             | Collation | Nullable | Default
----------+-----------------------------+-----------+----------+---------
 item_id  | integer                     |           |          |
 order_id | integer                     |           |          |
 name     | text                        |           |          |
 amount   | integer                     |           |          |
 added_at | timestamp without time zone |           |          |

                       Table "toy_shop.companies"
  Column    |            Type          | Collation | Nullable | Default
----------+-----------------------------+-----------+----------+---------
 brand_name | text                     |           |          |
 show       | text                     |           |          |
 year       | integer                  |           |          |

                        Table "toy_shop.user_data"
  Column    |            Type          | Collation | Nullable | Default
----------+-----------------------------+-----------+----------+---------
 name       | text                     |           |          |
 email      | text                     |           |          |
 
                         Table "toy_shop.us_states"
  Column    |            Type          | Collation | Nullable | Default
----------+-----------------------------+-----------+----------+---------
 state       | text                     |           |          |
 code        | text                     |           |          |
```

Toy shop started operating on 1 January 2021.
Toy shop data is stored in Postgres (re_data also works with BigQuery, Snowflake & Redshift)

