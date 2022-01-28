---
sidebar_position: 2
---

# Tests

re_data models (specifically `re_data_metrics` model) can be tested like any other dbt model. Because of the nature of metrics we created a couple of custom tests to help you with metrics testing.

Here is a very simple example of metrics tests

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

## Testing metrics vs testing models

Some of the metrics produced and possible tests for them may overlap with tests
you are already doing on your models.
In this case, we advise to:
 - testing things that cannot happen in your models tests
 - testing for warning things that are alerting (but can happen and you don't want to stop processing because of it with re_data metrics)

But of course, the best solution would still very much depend on your specific use case.

Overall metrics tests are very lightweight compared to data tests as data they are querying is already aggregated. This can make it possible for you to tests more things with keeping test running-time and costs low.


If you would like to ask about your use case, hit as on **[Slack! 😊](https://www.getre.io/slack)**
