---
sidebar_position: 1
---

# What is re_data?

re_data - fix bad data before your users & CEOs would discover it 😊

re_data is set of dbt macros & models which help you with making 
sure your data pipelines are clean & reliable.

## Data Preparation

re_data data preparation macros help you clean your data faster, with less code & smaller chance of errors.
Currently we support four types of data preparation:

- data cleaning
- data filtering
- data normalization
- data validation

## Data Monitoring

re_data metrics & alerts models contain information about data quality which let's you discover bad data much faster. You can:
 - extend them with your metrics
 - test them as normal dbt models
 - visualize them in your favorite BI
 - trigger external (Slack/Pagerduty/etc.) alerts based on them

## Installation

re_data is primarily a dbt package, so it's very easy to add to the existing dbt projects. Check out **[installation](/docs/getting_started/installation/for_dbt_users)** tutorial.

If you are not using dbt, re_data can still be a great option to start monitoring your existing tables. Check out installation for users: **[new to dbt](/docs/getting_started/installation/new_to_dbt)** in this case.

Have more questions? Check out the rest of re_data docs, or ask as on **[Slack! 😊](https://join.slack.com/t/re-data/shared_invite/zt-vkauq1y8-tL4R4_H5nZoVvyXyy0hdug)** (we are very responsive there)
