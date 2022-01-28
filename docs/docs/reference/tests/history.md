---
sidebar_position: 1
---

# Test history

re_data adds dbt macros which make it possible to save test history to your data warehouse & later on evistigate them with our relaiblity UI.

To start saving tests you just need to call re_data `save_test_history` macro in `on-run-end` hook. You can do it by adding code below into your `dbt_prroject.yml`. In case of having some other hooks existing already you just need to add this as item into the list.

```
on-run-end:
  - "{{ re_data.save_test_history(results) }}"

```