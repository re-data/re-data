---
sidebar_position: 0
dbt_docs_base_url: https://re-data.github.io/dbt-re-data
---


# Overview

## How metrics look like 

re_data metrics are currently *just* expressions which
are added to select statements run automatically by re_data.

```sql title="re_data query"
select metric1, metric2, metric3
from your_table
where data in time_window
```

These simple definitions still make it possible to create a wide variety of metrics.
In case metric is more than single sql expression, you can also create them by using sub queries in metric macros (more details in custom metrics section)

## Time based vs Global metrics

We recommend that most of your metrics computed would be time-based (data is then filtered by the `time_filter` column specified in config.

In cases when such a column is not available (or for some reason you don't want to use it),
re_data can compute global metrics for a table. Global metrics don't filter by time and work on data from the whole table. You can pass `time_filter: null` in the re_data table config to compute global metrics.

