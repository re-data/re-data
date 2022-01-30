---
sidebar_position: 5
---

# Models

All data produced by re_data is saved in dbt models. Let's go over the most important of them:

### re_data_metrics

This models contains (almost all - except schema changes) metrics computed by re_data. Here is how this table looks like:

```sql title="re_data_metrics" 
select * from dq_re.re_data_metrics
                id                |          table_name          | column_name |   metric    | value |  time_window_start  |   time_window_end   | interval_length_sec
----------------------------------+------------------------------+-------------+-------------+-------+---------------------+---------------------+--------------------
 5950d1123559dee165d999c9c85a71ce | "postgres"."dq"."buy_events" | value1      | min         |   107 | 2021-05-01 00:00:00 | 2021-05-02 00:00:00 |               86400
 4de8037a73b65339e940065968ab53be | "postgres"."dq"."buy_events" | value1      | max         |   107 | 2021-05-01 00:00:00 | 2021-05-02 00:00:00 |               86400
 5824e152ceb289fd4170e28964781296 | "postgres"."dq"."buy_events" | value1      | avg         |   107 | 2021-05-01 00:00:00 | 2021-05-02 00:00:00 |               86400

```
And here is a brief description of what all columns mean:
- `id` - unique id generated for column, generated from table_name, column_name, metric, time_window_start, time_window_end. In the case of these 5 metrics being the same for newly generated data, data for metric will be overwritten. 
- `table_name` - full name of the monitored table in your database
- `column_name` - column name, or empty value in case of table level metrics 
- `metric` - name of metric, are defined in **[metrics](/docs/reference/metrics/overview_metric)**
- `value` - value of a metric (curently all re_data metrics are numeric)
- `time_window_start` - timestamp of time window start
- `time_window_end` - timestamp of time window end
- `interval_length_sec` - length of time-window in seconds, used internally to compare same length time intervals when computing anomalies


### re_data_schema_changes

Schema changed are computed separately, this model contains all detected schema changes.

### re_data_monitored

Model containing:
 - table names
 - their time filters columns
 - and additional metrics to be computed for those.

This model refreshes each time re_data runs and describes what re_data computes. It is generated from your `dbt_project.yml` configurations plus the optional `re_data_tables` configuration saved in the data warehouse.

### re_data_tables 
This table is an optional way of defining what re_data computes. (apart from dbt_project vars configuration). 

2 columns can be edited in this table:
- `time_filter` to the name of the column you would like to use as a time filter.

 re_data prioritizes code configuration so changes will only affect tables that are not specified in `dbt_project.yml`. 

We strongly advise to not configure the same parameters both in DB and code. DB configuration is meant for people wanting to enable/disable lots of tables on the DB level as opposed to configuring them all in code.

### re_data_z_score
Computed z_score for metric. `re_data` looks back on what where metrics values in last 30 days and compute z_score for newest value.

### re_data_anomalies
View computed on top of `re_data_z_score` table to contain metrics that look alerting. Alerting threshold is controlled by var `re_data:alerting_z_score`
which is equal to 3 by default, but can be changed and adjusted.

