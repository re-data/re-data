---
sidebar_position: 2
---

# Features

## Data quality metrics
re_data creates data quality metrics schema in your data warehouse containing metrics for all your tables (or only those you would like to monitor) Metrics schema contains information about:

 - time since last records were added
 - number of records added
 - number of missing values in columns over time
 - min/max/avg of values in all your columns
 - string lengths in all your columns

Think about it as an INFORMATION_SCHEMA on steroids 💪 And this is just a start and in your project, you can compute many other data quality metrics specific to your organization.

## Detecting anomalies
re_data looks at metrics gathered and alerts if those are suspicious, comparing to data saw in the past. This means situations like those:

 - sudden drops or increases in the volume of new records added to your tables
 - longer than expected break between data arrivals
 - increase in NULL values in one of your columns
 - different maximal/minimal/avg numbers in any of table columns

Will be detected. All data including anomalies is saved directly into your data warehouse so you can easily integrate any existing alerting with it.

## Metrics testing

Gathered metrics can be tested same way you normally test data in dbt. re_data is also adding some specific generic tests for metrics.

**Why test quality metrics instead of data?**

Testing metrics can allows you to both:
 - run tests for multiple tables easily (without copying it everywhere)
 - save money & time on running your data tests
   - running tests can be big hidden costs for DW usage
   - time based metrics are much faster to test
