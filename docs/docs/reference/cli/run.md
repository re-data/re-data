---
sidebar_position: 1
---

# Run

`re_data run` CLI command is a helper command for computing & backfilling re_data observability data.

### run
```
re_data run --start-date 2021-01-01 --end-date 2021-01-30
```

The above command computes monthly re_data stats with (currently hardcoded) daily granularity. After running these commands re_data dbt specific models will have information about anomalies, metrics & schema changes happening in your data warehouse.