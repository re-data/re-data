---
sidebar_position: 1
---

# Quickstart - dbt users

This introduction assumes you are already using dbt in your company and tables you would like to monitor are managed by dbt.
To fully use re_data you would need to install both:
  -  **[re_data dbt package](#installing-re_data-dbt-package)**
  -  **[re_data python package](#installing-re_data-python-package)**

We'll go over the steps required to do that & explain what possibilities those packages create for you.

## Installing re_data dbt package

Add the re_data dbt package to your main dbt repo project.
You need to update your `packages.yml` file with re_data package like that:

```yml title="packages.yml"

packages:
    ***
    
    - package: re-data/re_data
      version: [">=0.9.0", "<0.10.0"]

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

Computing metrics & anomalies for your dbt models & sources requires configuring them to be observed by re_data. You can do it in a couple of ways, all of them described in **[re_data configuration](/docs/reference/config)** reference part. A simple configuration for a single model contains just information that the model should be monitored & timestamp expression (usually column name) to be used when computing re_data time-based stats.

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

Let's go over some of the things you already can use with re_data dbt package.

For specifics look into reference section:
 - **[re_data dbt models](/docs/reference/models)**
 - **[re_data metrics](/docs/reference/metrics/overview_metric)**
 - **[re_data asserts](/docs/reference/tests/asserts)**
 - **[re_data tests history](/docs/reference/tests/history)**
 - **[re_data data cleaning, filtering, normalization, validation macros](/docs/reference/macros/data_cleaning)**

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
single re_data run produces single data points about your tables for a time window. The default time window when you run re_data without parameters is yesterday. (from yesterday's 00:00 AM up until today 00:00 AM) To compare tables over time you would need to run the re_data dbt package multiple times (by some scheduler, re_data python package or manually).
:::

The following would create tables inside your `{default_schema}_re` schema of your database. This is configured in dbt and can be overwritten in your `dbt_project.yml`.

### Storing tests history (optional)

re_data enables you to store dbt tests results to investigate them later on. You can enable this functionality by setting:
```yml dbt_project.yml
vars:
  re_data:save_test_history: true
```

In your `dbt_project.yml` file. After that when you run:

```
dbt test
```

re_data will store test history and with option `--store-failures` is added, it will also store failures in `re_data_test_history` model.

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
 - **[re_data overview UI](/docs/reference/cli/overview)** - for generating & displaying re_data UI
 - **[re_data notify](/docs/reference/cli/notify)** - for notifying external services about alerts (currently Slack)
 - **[re_data run](/docs/reference/cli/run)** - for easily backfilling re_data dbt data

### Generate & Serve UI

Let's go over 2 commands for generating & serving UI. It works quite similarly to dbt docs. First you create files by calling `re_data overview generate` and then serving already existing files by `re_data overview serve`. For more details on paramters accepted by this & other re_data commands check **[re_data CLI reference](/docs/reference/cli/overview)**

```
re_data overview generate
re_data overview serve
```

## Learning more

More detailed instrutions on running re_data are described in out toy_shop **[example tutorial 😊](/docs/getting_started/toy_shop/toy_shop_data)** 

:::info
### Got stuck anywhere?
If you have more questions, got stuck anywhere, or something is not working as expected, please let us know on **[Slack! 😊](https://www.getre.io/slack)**, we will help you asap, and it will help us improve this quick start guide.