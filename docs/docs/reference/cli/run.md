---
sidebar_position: 1
---

# Run

`re_data run` CLI command is a helper command for computing & backfilling re_data observability data.

### run
```
re_data run --start-date 2021-01-01 --end-date 2021-01-30 --interval days:1
```

Running this command will create/fill re_data specific models with observability data.

Supported argments:
- start-date (*default: today - 7 days*) - start date of period for which you generate data
- end-date (*default: today*) - end date of period for which you generate data
- interval (*default: days:1*) - basic time grain for the overview, supported values - *days*, *hours*, example: **days:7**, **hours:1**.
