---
sidebar_position: 3
---

# Reliability UI 👀

Now let's investigate generated data in re_data UI. We first generate HTML/JSON from the data warehouse and then serve files.

```
re_data overview generate --start-date 2021-01-01 --interval days:1
re_data overview serve
```

:::info
We don't pass --end-date to `re_data overview generate` and this is causing re_data to use the default (today). We generate for this whole period to get also tests history (just ran) displayed
:::

After running these commands you should be able to see views similar to those:

## Alerts

![GraphExample](/screenshots/ui/alerts.png)

Alerts view lets you see if there are any problems currently detected in your data.
re_data compares past & current metric computed using **[z_score](https://en.wikipedia.org/wiki/Standard_score)** to determinate if value is suspicious.

From the alerts view, you can go to learn more details about specific alerts in the graph view.

## Schema Changes
The alerts view also shows any schema changes detected. These schema changes include detecting when columns were added, removed or had its type changed. For tutorial purposes, we modify using the schema of the orders table using macros included in the default template.

```bash
# this operation adds a column to the orders table
dbt run-operation schema_change_add_orders_column
# run re_data models to detect the column added schema change
re_data run
# this operation drops the column added earlier
dbt run-operation schema_change_drop_orders_column
# re-run re_data models to detect the removed column
re_data run
```

Regenerating the user interface shows:

![AlertsWithSchemaChanges](/screenshots/ui/alerts_with_schema_changes.png)

## Lineage

![GraphExample](/screenshots/ui/graph.png)

Lineage view lets you investigate anomalies, metrics & schema changes on top of the dbt lineage graph.


## Tests

![GraphExample](/screenshots/ui/tests.png)

Tests view lets you see history of all dbt tests run. (re_data comes with a `save_test_history` macro which when passed into `on-run-end` dbt configuration, saves tests history into the data warehouse)


## Tables

![GraphExample](/screenshots/ui/tables.png)

Tables view lets you investigate any table easily. Check out for anomalies, metrics, tests related to it.

In the next section, let's see how we can notify ourselves about problems in the data
