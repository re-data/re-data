---
sidebar_position: 3
---

# Observability UI 👀

Now let's investigate generated data in re_data UI. We first generate HTML/JSON from the data warehouse and then serve files.

```
re_data overview generate --start-date 2021-01-01 --end-date 2021-01-30 --interval days:1
re_data overview serve
```

After running these commands you should be able to see views similar to those:

## Alerts

![GraphExample](/screenshots/ui/alerts.png)

Alerts view lets you see if there are any problems currently detected in your data.
re_data compares past & current metric computed using **[z_score](https://en.wikipedia.org/wiki/Standard_score)** to determinate if value is suspicious. It also shows any schema changes detected here.

From the alerts view, you can go to learn more details about specific alerts in the graph view.

## Graph

![GraphExample](/screenshots/ui/graph.png)

Graph view lets you investigate anomalies, metrics & schema changes on top of the dbt lineage graph.

## Use cases 

re_data observability UI meant to help you:

 - gain more confidence in data produced 😊
 - know first if any problems are appearing in the data
 - analyse anomaly & schema change impact on other tables
 - find the root cause for the problems appearing
 - share information with team members & other teams easily

## Want to learn more?

Check out the rest of re_data docs, or ask as on **[Slack! 😊](https://www.getre.io/slack)** (we are very responsive there)
