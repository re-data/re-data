---
sidebar_position: 1
---

# Quickstart - dbt users

This introduction assumes you are already using dbt in your company and tables you would like to monitor are managed by dbt.
To fully use re_data you would need to install both:
  -  **[re_data dbt package](#install-re_data-dbt-package)**
  -  **[re_data python package](#install-re_data-python-package)**

We'll go over the steps required to do that & explain what possibilities those packages create for you.

## Installing re_data dbt package

Add the re_data dbt package to your main dbt repo project.
You need to update your `packages.yml` file with re_data package like that:

```yml title="packages.yml"

packages:
    ***
    
    - package: re-data/re_data
      version: [">=0.7.0", "<0.8.0"]

```

And then install dbt packages dependencies by running:

```
dbt deps
```

You can do that locally, in your dbt cloud environment, or Airflow etc. scheduler enviornment.

:::info
On production, you most likely are already running `dbt deps` as part of dbt models computation. So this step maybe only necessary for your local environment.
:::

### Configuring tables

Computing metrics & anomalies for your dbt models & sources requires configuring them to be observed by re_data. You can do it in a couple of ways, all of them described in **[re_data configuration](reference/config.mdx)** reference part. A simple configuration for a single model contains just information that the model should be monitored & timestamp expression (usually column name) to be used when computing re_data time-based stats.

```sql title="<model_name>.sql"
{{
    config(
      re_data_monitored=true,
      re_data_time_filter='time_column_name',
    )
}}
select ...
```

### dbt package functionality

Let's go over some of the things you alrady can use with re_data dbt package.

For specifics look into reference section:
 - **[re_data dbt models](/reference/models.md)**
 - **[re_data metrics](/reference/metrics/overview_metric.md)**
 - **[re_data tests history & custom tests](/reference/tests/history.md)**
 - **[re_data data cleaning, filtering, normalization, validation macros](/reference/macros/data_cleaning.md)**

dbt auto generated documentation, together with our models graph is also available: **[here](https://re-data.github.io/dbt-re-data/#!/model/model.re_data.re_data_monitored)**

:::info
re_data macros don't require any configuration and can be just used after you add re_data into your environment.
:::

### Computing first metrics

To compute re_data models containing metrics & anomalies you can just run standard dbt command.

```
dbt run --models package:re_data
```
:::info
single re_data run produces single data points about your tables for a time window. The default time window when you run re_data without parameters is yesterday. (from yesterday's 00:00 AM to up until today 00:00 AM) To compare tables over time you would need to run the re_data dbt package multiple times (by some scheduler, re_data python package or manually).
:::

The following would create tables inside your `{default_schema}_re` schema of your database. This is configured in dbt and can be overwritten in your `dbt_project.yml`.

## Installing re_data python package

To generate re_data reliability UI, send re_data alerts to Slack and easily backfill re_data models you will need to install the re_data python library. For this step, you need to have a python environment (with dbt installation) setup. Install re_data by executing:

```
pip install re_data
```

:::info
re_data python library should be installed in the same python environment where your dbt is installed. re_data makes use of dbt to run queries against your database. Because of that, you don't need to pass any DB credentials to re_data configuration. re_data by default will run dbt with the same credentials & profiles which you have in your `dbt_project.yml` and `~/.dbt/profiles.yml` files. You can also change this behaviour by passing options to the re_data command.
:::

### Python package functionality

Python package add enabled you to use this functionality:
 - **[re_data overview UI](/reference/cli/overview.md)** - for geneating & displaying re_data UI
 - **[re_data notify](reference/cli/notify.md)** - for notifying external services about alerts (currently Slack)
 - **[re_data run](reference/cli/run.md)** - for easily backfilling re_data dbt data

### Generate & Serve UI

Let's go over 2 commands for generating & serving UI. It works quite similarly to dbt docs. First you create files by calling `re_data overview generate` and then serving already existing files by `re_data overview serve`. For more details on paramters accepted by this & other re_data commands check **[re_data CLI reference](/reference/cli/overview.md)**

```
re_data overview generate
re_data overview serve
```

## Learning more

More detailed instrutions on running re_data are described in out toy_shop **[example tutorial 😊](getting_started/toy_shop/toy_shop_data.md)** 