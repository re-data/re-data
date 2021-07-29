---
sidebar_position: 2
---

# Models

Models created by re_data.

### re_data_tables
Information about all monitored tables. This is currently only table which is supposed to be edited (you can think of it as a configuration table) 
2 columns can be changed there:
- Change `actively_monitored` to `true`/`false` to start/stop monitoring table and computing stats for it, `(default: false)`
- Change `time_filter` to name of column you would like to use as time filter
Time filter is important thing in `re_data`, it's used in all filters computing metrics (to filter records added in a given day)
On the start some educated guess 🙂 is assigned as this field, but quite often it may require to be changed. `(default: first timestamp type column)`


### re_data_columns
Information about all monitored columns, this contains information about columns similar to this
what you can find in `information_schema`. This table is not supposed to be edited and new columns will be added and old removed
in case of schema changes for your tables.

### re_data_freshness
Information about time (in seconds) since last data was added to each table. `time_filter` column is used to find about
time record was added. If `time_filter` column is updated, update time will also be taken into account, but be warned that in this case
all stats computed will also take into account updated time (This maybe good or bad thing depeneding on your use case).

### re_data_row_count
Numbers of rows added to table in specific time range.

### re_data_count_nulls
Number of nulls in a given column for specific time range.

### re_data_count_missing
Number of nulls and empty string values in a given column for specific time range.

### re_data_min
Minimal value appearing in a given column for specific time range.

### re_data_max
Maximal value appearing in a given column for specific time range.

### re_data_avg
Average of all values appearing in a given column for specific time range.

### re_data_min_length
Minimal length of all strings appearing in a given column for specific time range.

### re_data_max_length
Maximal length of all strings appearing in a given column for specific time range.

### re_data_avg_length
Average length of all strings appearing in a given column for specific time range.

### re_data_base_metrics
Internal table containing most of described metrics (apart from `re_data_freshness`). To really access
metrics it's usually better to use view for specific metric.

### re_data_z_score
Computed z_score for metric. `re_data` looks back on what where metrics values in last 30 days and compute z_score for newest value.

### re_data_alerting
View computed on top of `re_data_z_score` table to contain metrics which look alerting. Alerting threshold is controled by var `re_data:alerting_z_score`
which is equal to 3 by default, but can be changed and adjusted.

### re_data_schema_changes

All schema changes in `actively_monitored` tables in period monitored by `re_data`. 


*Notice! `re_data` doesn't find out about past schema changes (those before starting running re_data) This is different to other metrics which take into account `re_data:time_window_end` and `re_data:time_window_start` and can compute metrics for the past data.*