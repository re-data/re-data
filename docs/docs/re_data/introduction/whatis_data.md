---
sidebar_position: 1
---

# What is re_data?

re_data is an open-source data reliability framework for modern data stack. 😊

Currently, re_data focuses on observing the dbt project (together with underlying data warehouse - Postgres, BigQuery, Snowflake, Redshift).

# Live demo


Check out our **[live demo](https://re-data.github.io/re-data/ui-latest/#/alerts)** of what re_data can do for you! 😊

![GraphExample](/screenshots/ui/graph.png)

## Alerts

re_data detects potential problems in your data like:
 - anomalies (suspicious data patterns),
 - failed dbt tests (**new in 0.8.0** 🎉),
 - schema changes

and alerts you on Slack or Email and in re_data UI so that you can react, investigate and fix issues quickly. You can even setup more granual alerts for specific groups of people using **[`re_data_owners`](/docs/re_data/reference/config#re_data_owners-optionalsetting)** setting.

## Metrics
For detecting anomalies re_data uses metrics. You can compute predefined and custom metrics about your data. All metrics are stored in your database and accessible for you. re_data custom metrics are just dbt macros which you can add to your dbt project. Check out what base, extra metrics re_data has and how you can define your own metrics here:

 - **[default metrics](/docs/re_data/reference/metrics/default_metrics)**
 - **[extra metrics](/docs/re_data/reference/metrics/extra_metrics)**
 - **[defining your own metric](/docs/re_data/reference/metrics/your_own_metric)**

## Asserts
**(new in 0.8.0 🎉)**

re_data contains asserts library which enable you to test computed metrics using dbt tests. This additonal step allows you to make sure the data is correct and meets your expectations. Example tests in our asserts library:

 - **[re_data.assert_in_range](/docs/re_data/reference/tests/asserts#assert_in_range)**
 - **[re_data.assert_true](/docs/re_data/reference/tests/asserts#assert_true)**
 - **[re_data.assert_equal](/docs/re_data/reference/tests/asserts#assert_equal)**

## Test history
re_data stores dbt tests history and let's you investigate test details like SQL which was run or failed rows for each runned test.

## Lineage
re_data shows data lineage for your data warehouse. (This is imported from the dbt graph). You can navigate your data & investigate alerts & metrics related to each node in the graph.

## Cleaning macros 🧹
re_data ships with a set of macros to save you time and pain of writing code for cleaning / normalizing / validating your data. Use them to make your project cleaner 😊. You can also use them as a base for your own metrics or data tests. Example macros in our data cleaning library include:

 - **[re_data.filter_remove_duplicates](/docs/re_data/reference/macros/data_filtering#filter_remove_duplicates)**
 - **[re_data.is_number_decimal_point](/docs/re_data/reference/macros/data_validation#is_number_decimal_point)**
 - **[re_data.clean_blacklist](/docs/re_data/reference/macros/data_cleaning#clean_blacklist)**


# Getting started

re_data is very easy to add to existing dbt projects. Check out **[quickstart](/docs/getting_started/installation/for_dbt_users)** instructions and follow **[toy shop](/docs/getting_started/toy_shop/toy_shop_data)** tutorial to see how you can generate re_data reliability data & UI for your data warehouse.

If you are not using dbt, re_data can still be a great option to start monitoring your existing tables. Check out installation for new users: **[new to dbt](/docs/getting_started/installation/new_to_dbt)** in this case.


:::info
### More questions?
Ask as on **[Slack! 😊](https://www.getre.io/slack)**. We will help you asap and you will help us improve our documentation
:::