#!/bin/bash

dbt_profile=$1

dbt --version
dbt deps
dbt run-operation create_toy_shop_source_tables --profile $dbt_profile
dbt seed --profile $dbt_profile
dbt run --exclude package:re_data --profile $dbt_profile
dbt test --exclude package:re_data --profile $dbt_profile || true
re_data run --start-date 2021-01-01 --end-date 2021-01-15 --profile $dbt_profile
dbt test --exclude package:re_data --profile $dbt_profile || true
dbt run-operation schema_change_add_orders_column --profile $dbt_profile
re_data run --start-date 2021-01-15 --end-date 2021-01-16 --profile $dbt_profile
dbt run-operation schema_change_drop_orders_column --profile $dbt_profile
re_data run --start-date 2021-01-16 --end-date 2021-01-31 --profile $dbt_profile
dbt test --exclude package:re_data --profile $dbt_profile || true
re_data overview generate --start-date 2021-01-01 --end-date 2022-06-30 --profile $dbt_profile