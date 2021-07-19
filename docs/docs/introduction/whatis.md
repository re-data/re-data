---
sidebar_position: 1
---

# What is re_data?

re_data is data quality framework. It lets you do queries similar to those:

```sql title="Your Data Warehouse"
select * from anomalies_in_row_counts;

select * from recent_schema_changes;

select * from all_tables_freshness order by last_update_time;

select * from daily_null_percent where table = 'X' and col = 'Y';
```

in your Snowflake, Redshift, BigQuery, Postgres DB.

Build as dbt-package & optional python lib. 

It let's you know what's happening in your data.

And you can visualize it, any way you want in your favorite BI tool.

