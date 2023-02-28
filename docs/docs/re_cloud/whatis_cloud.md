---
sidebar_position: 0
---

# What is re_cloud?

re_cloud enables you to make your data reports (like dbt-docs, great_expectation docs, custom html reports, re_data report) available online to your team and business users.

# Why do I need it?

We talked with more than a 100 companies on how they are storing output from tools like dbt-docs, great-expectations, our open-source library and others. Answer is almost always the same - S3, GCS, github pages.

But those methods makes it hard to share reports with your team and business users. You need to learn how to setup permissions, buckets, github pages and more.

With re_cloud using single line of code like:
```
re_cloud upload dbt-docs
```

You can make your docs available to your team and business users.

And apart from just viewing them, you are getting new previously impossible features avaiable to you like:

 - dashboard with all the reports in one place
 - possiblity to view each report version history (to debug what changed)
 - predefined & customized slack notifications
 - and much more comming soon! :rocket:
 
# Getting started

If you are curious about re_cloud and would like to jump right into it, you can start with a **[free trial here](https://cloud.getre.io/#/register)**

To see docs on how to upload reports into the cloud check our **[Quickstart guide](/docs/re_cloud/quickstart)**

![DashboardExample](/re_cloud/flows/dashboard.png)