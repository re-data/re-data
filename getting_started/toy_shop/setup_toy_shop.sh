#!/bin/bash
set -e

dbt_profile=$1

dbt run-operation create_toy_shop_source_tables --profile $dbt_profile
dbt seed --profile $dbt_profile
dbt run --exclude package:re_data --profile $dbt_profile
dbt test --exclude package:re_data --profile $dbt_profile || true
re_data run --start-date 2021-01-01 --end-date 2021-01-06 --profile $dbt_profile
dbt test --exclude package:re_data --profile $dbt_profile || true
dbt run-operation schema_change_add_orders_column --profile $dbt_profile
re_data run --start-date 2021-01-06 --end-date 2021-01-07 --profile $dbt_profile
dbt run-operation schema_change_drop_orders_column --profile $dbt_profile
re_data run --start-date 2021-01-07 --end-date 2021-01-11 --profile $dbt_profile
dbt test --exclude package:re_data --profile $dbt_profile || true
re_data overview generate --start-date 2021-01-01 --end-date 2022-06-30 --profile $dbt_profile