---
sidebar_position: 3
---

# Table Samples

re_data samples data for tables which are [monitored](config#re_data_monitored) by querying the most recent rows. If the monitored table has a [time_filter](config#re_data_time_filter), then that time filter is used to order the rows, else no time filter is used.

To enable table sampling, we set the [`re_data:store_table_samples`](config#re_datastore_table_samples-true) key to true in vars as shown below

```yaml title="dbt_project.yml"
vars:
  re_data:store_table_samples: true
```

Recent rows sample can be found in the Tables section in the Observability UI as shown below.

![EmailAlertMessage](/screenshots/ui/table_samples.png)