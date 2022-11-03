---
sidebar_position: 1
---
# Asserts

re_data comes with asserts library, created to test metrics computed.
You can use those as tests in `schema.yml` of every model monitored by re_data.

re_data asserts can be applied both as table and column level tests as show in the example.

```sql title="schema.yml"  
version: 2

models:
  - name: buy_events
    tests:
      - re_data.assert_in_range:
          metric: row_count
          min_value: 0
          max_value: 10

    columns:
      - name: value1
        tests:
          - re_data.assert_true:
              metric: nulls_percent
              expression: value = 0

      - name: value2
        tests:
          - re_data.assert_greater:
              metric: min
              value: 200
              condition: time_window_start >= '2020-05-02'

```



:::info
Asserts have a set of standard params with the same meaning in all tests:
- metric: name of the metric you are testing
- expression: an expression which re_data will evaluate to be true or false. Use `value` to indicate the value of a metric computed. Example expression: `value > 0` asserts that metric is greater than 0
- value - a number to which you would like to compare metric. Example: `value: 5` in the `assert_greater` test would check if all metric values are larger than 5
- min_value, max_value - similarly to `value` re_data will compare metric values to values passed here
- condition: (optional) time filter for the metric, if you would like to tests only metric from specific time range. User `time_window_start` or `time_window_end` to compare against time. Example: `time_window_start > '2020-05-02'` will check only metrics computed later than on '2020-05-02'
:::

### assert_true

Accepted params:
- metric
- expression
- condition

Assert that given expression is true for the metric computed.

```
- re_data.assert_true:
    metric: nulls_percent
    expression: value = 0
    condition: time_window_start >= '2020-05-02' # (optinal)
```


### assert_false

Accepted params:
- metric
- expression
- condition

Assert that given expression is false for the metric computed.

```
- re_data.assert_false:
    metric: freshness
    expression: value is null
```

### assert_in_range

Accepted params:
- metric
- min_value
- max_value
- condition

Assert that metric value is between min_value and max_value (inclusive)

```
- re_data.assert_in_range:
    metric: row_count
    min_value: 0
    max_value: 10
```

### assert_equal

Accepted params:
- metric
- value
- condition

Assert that metric value is equal to specified value

```
- re_data.assert_equal:
    metric: row_count
    value: 1
```

### assert_greater

Accepted params:
- metric
- value
- condition

Assert that metric value is greater to specified value

```
- re_data.assert_greater:
    metric: min
    value: 200
```


### assert_greater_equal

Accepted params:
- metric
- value
- condition

Assert that metric value is greater or equal specified value

```
- re_data.assert_greater_equal:
    metric: my_distinct_table_rows
    value: 10
```

### assert_less

Accepted params:
- metric
- value
- condition

Assert that metric value is smaller specified value

```
- re_data.assert_less:
    metric: min
    value: 100
```

### assert_less_equal

Accepted params:
- metric
- value
- condition

Assert that metric value is smaller or equal to specified value

```
- re_data.assert_less_equal:
    metric: min
    value: 107
```

If you would like us to add some other tests, information about tests history, etc., join **[Slack! 😊](https://www.getre.io/slack)** and let us know! 😊  
