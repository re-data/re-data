---
sidebar_position: 5
---

# Q&A

### Is re_data similar to Great Expectations?

Yes, it's similar, we believe at least in a couple of ways it's better 😊

The thing re_data does well is letting you create time-based metrics about your data quality instead of just tests (a lot of the tests can be rewritten to that). 
That allows you to do a couple of things more than GE tests:
  - you can visualize your metrics
  - automatically look for anomalies (in hundreds of your tables)

You can often also compute tests much more efficiently (on metrics, not raw data)

Apart from that re_data is definitely more convenient when you are already using dbt and don't want to set up a separate workflow assessing data quality when it can be done with dbt inside your data warehouse.

Research about computing metrics as a good way of doing data quality was actually done by the team behind deequ: http://www.vldb.org/pvldb/vol11/p1781-schelter.pdf

### Can I compute business metrics in re_data?

re_data is meant for metrics which inform you about the problems in data. Monthly revenue dropping by 30% will definitely be seen as a problem for many people.
 So we think it's good to track it with re_data in your data warehouse. In general metrics which can be pre-computed and stored in DWH are good candiates
for metrics to add to re_data.

Still a lot of business metrics aren't like that, BI tools enable users choose different dimensions & filters and investigate metrics this way. This type of metrics are not good candidates to using with re_data and storing with DWH, as you would need to pre-compute everything user can actually query (and it quickly grows exponentially).

### How do I run re_data?

re_data doesn't have any internal scheduler and it's leaving the operation of regularly computing metrics for you to set up. We believe it's best to use existing scheduling tools your company has and we are not trying to build one. 

As re_data is a dbt package, you can (and we have installations of that) run re_data using just dbt cloud & set up jobs for computing metrics there. But definitely others methods like running it in Airflow dag are also possible.

#### Other questions?

Have more questions? Ask as on **[Slack! 😊](https://join.slack.com/t/re-data/shared_invite/zt-vkauq1y8-tL4R4_H5nZoVvyXyy0hdug)** (we are very responsive there)
