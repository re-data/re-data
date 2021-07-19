---
sidebar_position: 3
---

# Macros


### test_values_between(model, column_name, table_name, low, high)

More enables you to test if metric for specific table_name is between low-high range

Example usage:

```yml title=schema.yml
models:
  - name: row_counts
    tests:
      - re_data.values_between:
          table_name: '"toy_shop"."orders"'
          column_name: value
          low: 0
          high: 10000

```

This will check if metrics gathred for specific table are inside a range


We're just starting with adding macros.

If you have ideas on new ones let us know of on [Slack! 🙂](https://www.re-data.io/slack) 
