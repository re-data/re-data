---
sidebar_position: 1
---

# Config

re_data introduces the following variables to `dbt_project.yml`. Let's go over them.

```yml dbt_project.yml
vars:
  re_data:alerting_z_score: 3
  re_data:schemas:
    - schema_to_monitor
    - another_schema_to_monitor
  re_data:time_window_end: '2021-06-03 00:00:00'
  re_data:time_window_start: '2021-06-02 00:00:00'
  re_data:anomaly_detection_look_back_days: 30
  re_data:actively_monitored_by_default: false
```
  

### re_data:alerting_z_score

Threshold for alerting, you can left it as is or update depending on your experience.  (By default it's 3)

### re_data:schemas

Schemas to be monitored, re_data will inspect all tables from those schemas, you choose which tables to monitor and set up this in your DB.
By default `re_data` queries the same DB as your dbt project (usually defined in `~/.dbt/profiles.yml` file). In BigQuery and Snowflake, schemas passed can also take the form of `db_name.schema_name` which will cause `re_data` to query `db_name` specified to find tables to monitor.

### re_data:time_window_start

Most of re_data metrics are time based, you choose for what time range metrics should be computed. Single dbt run will compute metrics from single time range. Start specifies start of this time range.

:::info

Most of `re_data` models & metrics use both `re_data:time_window_start` & `re_data:time_window_end` to filter data when computing metrics.
But there are some expeptions:
 * `re_data_freshness` model uses only `re_data:time_window_end` to filter data for quality metrics
 * `re_data_schema_changes` models doesn't use any time filter
 
:::


### re_data:time_window_end

End specifies start of this time range. 🙂


### re_data:anomaly_detection_look_back_days

Period which `re_data` considers when looking for anomalies. (By default it's 30 days)

### re_data:actively_monitored_by_default

By default re_data doesn't compute metrics for all detected tables, if you want it to happen, you can setup this here.

*WARNING! We don't normally advice on that, unless you are sure detected tables will have
correct time columns found.*