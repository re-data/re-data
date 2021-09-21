---
sidebar_position: 1
---

# What is re_data?
re_data lets data teams compute various metrics about their datasets and later on:
  - test
  - visualize
  - find anomalies in those

re_data is meant to help data teams find, debug data problems and sleep well knowing they they will know if something unexpected happens.

re_data works strictly inside your data warehouse - by doing transformations on your tables. It let's you improve your data without it needing to leave your data warehouse.

## How to use re_data?

re_data is primarily a dbt package, so it's easy to add to the existing dbt projects. Check out **[installation](/docs/getting_started/installation/for_dbt_users)** tutorial.

You can compute a lot of build-in metrics like: `row_count`, `missing_count`, `freshness`, `schema_changes`.
See all currently available: **[metrics](/docs/reference/metrics)**, and also define your own metrics in your dbt project:

```sql title="macros/my_metrics.sql"    
{% macro re_data_metric_diff(column_name) %}
    max({column_name}) - min({column_name})
{% endmacro %}
```

You can compute simple metrics for all your datasets and add custom metrics for specific tables. (Check out example **[config](/docs/reference/config)**) re_data will track all computed metrics and look for **[anomalies](/docs/reference/anomalies)** in them and you can also test them using our build-in **[tests](/docs/reference/tests)**.

All your metrics are stored as tables (dbt **[models](/docs/reference/models)**) in your data warehouse and because of that available to you in your:
 - BI tools,
 - Data Warehouse UIs,
 - SQL clients

re_data groups the metrics (from multiple tables) together and keeps them in one common format, which makes it easy to create a dashboard for data quality. Check out **[visualizations](/docs/bi_integration/introduction)**. examples.

Have more questions? Check out the rest of re_data docs, or ask as on **[Slack! 😊](https://www.re-data.io/slack)** (we are very responsive there)