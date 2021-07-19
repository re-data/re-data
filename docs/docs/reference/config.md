---
sidebar_position: 1
---

# Config

re_data introduced fallowing variables to `dbt_project.yml`.
Lets go over them.

```yml dbt_project.yml
vars:
  re_data:alerting_z_score: 3
  re_data:schemas:
    - schema_to_monitor
    - another_schema_to_monitor
  re_data:time_window_end: '2021-06-03 00:00:00'
  re_data:time_window_start: '2021-06-02 00:00:00'
  re_data:actively_monitored_by_default: false
```
  

### `re_data:alerting_z_score`

Threshold for alerting, you can left it as is or update depending on your experience.

### `re_data:schemas`

Schemas to be monitored, re_data will inspect all tables from those schemas, you choose which tables to minitor and setup this in your DB.


### `re_data:time_window_start`

re_data metrics are time based, you choose for what time range metrics should be computed. Single dbt run will compute metrics from single time range.

Start specifies start of this time range.

### `re_data:time_window_end`

End specifies start of this time range. 🙂


### `re_data:actively_monitored_by_default`

By default re_data doesn't compute metrics for all detected tables, if you want it to happen, you can setup this here.

*WARNING! We don't normally advice on that, unless you are sure detected tables will have
correct time columns found.*