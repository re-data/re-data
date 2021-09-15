---
sidebar_position: 0
---

# Anomalies

re_data looks at metrics gathered and alerts if those are suspicious, comparing to data saw in the past. This means situations similar to those.

- sudden drops or increases in the volume of new records added to your tables
- longer than expected break between data arrivals
- increase in NULL values in one of your columns
- different maximal/minimal/avg numbers in any of the table columns

Will be detected.

## How it works?

re_data is currently using z_score to detect anomalies. All detected anomalies are showing up in `re_data_alerting` model.

## Alerting notifications

To receive notifications you would need to set up, tests for `re_data_alerting` table. We recommend adding tests checking for any recent alerts to a dbt test suite.