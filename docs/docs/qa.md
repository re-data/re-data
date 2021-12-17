---
sidebar_position: 5
---

# Q&A 💬

### How do I run re_data?

re_data doesn't have any internal scheduler and it's leaving the operation of regularly computing metrics for you to set up. We believe it's best to use existing scheduling tools your company has and we are not trying to build one. 

As re_data is a dbt package, you can (and we have installations of that) run re_data using just dbt cloud & set up jobs for computing metrics there. But definitely others methods like running it in Airflow dag are also possible.

### What are common examples of "bad data"?

Here is are a couple of problems we call "bad data":

 - Data is incomplete (or sometimes just empty)
   - Think about your data missing an important source which other team stopped a week ago
   - is based on 1000, not 100000 rows which normally come from the source
   - is just still empty for an important board meeting...

 - Data is based on erroneous assumptions
   - For example, you assumed there will be no `nulls` in the table or from another side `nulls` were supposed to be there and suddenly `zeroes` appear instead breaking averages computed by reports.
   - Records in this table were not supposed to have any duplicate names, IDs, etc...


#### Other questions?

Have more questions? Ask as on **[Slack! 😊](https://join.slack.com/t/re-data/shared_invite/zt-vkauq1y8-tL4R4_H5nZoVvyXyy0hdug)** (we are very responsive there)
