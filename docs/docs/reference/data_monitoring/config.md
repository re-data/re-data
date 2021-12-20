---
sidebar_position: 0
---

# Config

To run re_data you would usually need to set up some variables in your `dbt_project.yml` config. Below example configuration followed with an explanation of it.

```yml dbt_project.yml
# to enable re_data models
models:
  re_data:
    enabled: true

vars:
  # if not passed, last day stats will be computed
  re_data:time_window_start: '{{ (run_started_at - modules.datetime.timedelta(1)).strftime("%Y-%m-%d 00:00:00") }}'
  re_data:time_window_end: '{{ run_started_at.strftime("%Y-%m-%d 00:00:00") }}'

  # *required if you want to configure re_data in code (not in DB)
  re_data:monitored:

    - schema: dq_raw # (optional)
      database: postgres # (optional)
      tables:
        - name: sample_table
          time_filter: creation_time

          # (optional) specify columns for which re_data should run
          columns:
            - event_type
            - value1
            - value2
          
          metrics: # my additional metrics for table
            table:
              - my_custom_table_metric
              - distinct_rows:
                  key: value # table metrics can take in config unique to it.

            column:
              event_type:
                - distinct_count
                - match_regex:
                    regex: ([A-Za-z0-9]+) # passing a key value pair of config to a column metric.

        - name: sample_with_anomaly
          time_filter: creation_time

      # this would work for all tables in the list
      actively_monitored: true

  # (optional) if not passed, all metrics below except custom 
  # ones will be used
  re_data:metrics_base:
    table:
      - row_count
      - freshness
      - buy_count # my own custom metric
      
    column:
      numeric:
        - min
        - max
        - avg
        - stddev
        - variance
        - nulls_count
        - diff # my own custom metric
        
      text:
        - min_length
        - max_length
        - avg_length
        - nulls_count
        - missing_count

  # (optional) global z_score threshold to use for alerting
  # usually keeping default will be enough
  re_data:alerting_z_score: 3

  # (optional) tells how much hisory you want to consider when looking for anomalies
  re_data:anomaly_detection_look_back_days: 30
```

### re_data:time_window_start, re_data:time_window_end

re_data metrics are time-based. (re_data filters all your table data to a specific time window.)
In general, we advise setting up a time window this way that all new data is monitored.
It's also possible to compute metrics from overlapping data for example last 7 days.

By default, re_data computes daily stats from the last day (it actually uses exact configuration from example for that)

### re_data:monitored

One of the most important settings. You can define here:
  - what tables you would like to monitor
  - what columns you would like to use for time filtering in them
  - what metrics to compute for those tables

`re_data:monitored` is expected to be a list with elements containing: `schema`, `database`, ``tables`` keys.
`tables` key is expected to be a list of tables to monitor.

(`schema`, `database` keys are optional here, if not passed re_data will use dbt project schema/database to infer those, you still need to pass: `re_data:schemas` with all schemas to monitor)

Each element of `tables` has:
  - `name` which is the name of the table (dbt model, seed, source)  
  - `time_filter` column for time filter (`null` in case you would like to compute global metric)
  - `actively_monitored` information if you with to monitor table
  - `columns` if you would like to run re_data only for subset of columns specify them here
  - `metrics` what additional metrics you would like to compute for tables. Check out the exact syntax in the config example.

Notice, above table settings, except `name` can be also set for all 
tables at once (check `actively_monitored: true` usage in the example)

### re_data:metrics_base

This is a set of metrics to compute for all monitored tables.
Some metrics like `row_count` are table level, others are specified
per column type: so that expression will be run for all columns of this type.

Here you only add metrics if you want to compute them for all tables which are monitored. If you want to add metrics to be computed for a specific table (or tables) you can do it with `re_data:monitored` var.

### re_data:alerting_z_score

The threshold for alerting, you can leave it as is or update depending on your experience.  (By default it's 3)


### re_data:anomaly_detection_look_back_days

The period which `re_data` considers when looking for anomalies. (By default it's 30 days)
