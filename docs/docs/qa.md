---
sidebar_position: 5
---

# Q&A

### Can I compute business metrics in re_data?

re_data monitoring is meant for metrics which inform you about the problems in data. Monthly revenue dropping by 30% will definitely be seen as a problem for many people. So we think it's good to track it with re_data in your data warehouse. In general metrics which can be pre-computed and stored in DWH are good candiates for metrics to add to re_data.

Still a lot of business metrics aren't like that, BI tools enable users choose different dimensions & filters and investigate metrics this way. This type of metrics are not good candidates to using with re_data and storing with DWH, as you would need to pre-compute everything user can actually query (and it quickly grows exponentially).

### How do I run re_data?

re_data doesn't have any internal scheduler and it's leaving the operation of regularly computing metrics for you to set up. We believe it's best to use existing scheduling tools your company has and we are not trying to build one. 

As re_data is a dbt package, you can (and we have installations of that) run re_data using just dbt cloud & set up jobs for computing metrics there. But definitely others methods like running it in Airflow dag are also possible.

#### Other questions?

Have more questions? Ask as on **[Slack! 😊](https://join.slack.com/t/re-data/shared_invite/zt-vkauq1y8-tL4R4_H5nZoVvyXyy0hdug)** (we are very responsive there)
