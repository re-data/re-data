---
sidebar_position: 2
---

# Testing metrics

re_data models (specifically `re_data_metrics` model) can be tested like any other dbt model. Because of the nature of metrics we created a couple of custom tests to help you with metrics testing.

Here is an example of metrics tests

```sql title="models/metrics/re_data_metrics.yml"  
version: 2

models:
  - name: re_data_metrics
    tests:
      - re_data.metric_expression_is_true:
          table: ref('buy_events')
          metric: max_length
          column_name: event_type
          expression: value = 3

      - re_data.metric_equal_to:
          table: ref('buy_events')
          metric: max_length
          column_name: event_type
          value: 3

      - re_data.metric_in_range:
          table: ref('buy_events')
          metric: max_length
          column_name: event_type
          min_value: 3
          max_value: 3

      - re_data.metric_expression_is_true:
          table: ref('buy_events')
          metric: row_count
          expression: value > 0 and value < 10
          condition: time_window_start >= '2021-05-02'
```

## Built-in metrics tests

### metric_expression_is_true

Most flexible test. It accepts:
 - table - which should be a ref to model which metrics we want to test
 - metric - name of the metric
 - column_name - the name of column (you should skip this for table_level metrics)
 - condition - filtering condition, when you only want to tests only metrics for a limited time window.
 - expression - any expression, as re_data_metrics stores metric value in `value` column 😊 You would usually write some expression with `value` column used.

### metric_equal_to

Simple shortcut which lets you check if the metric has one specific value

### metric_in_range

Simple shortcut which lets you check if metric values are in the range

## Other test use cases

If you would like us to add some other tests, information about tests history, etc., join **[Slack! 😊](https://www.getre.io/slack)** and let us know! 😊  
