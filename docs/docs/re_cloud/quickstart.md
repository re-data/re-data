---
sidebar_position: 1
---

# Quickstart 🚀

In this quick tutorial we will deploy the UI of re_data & dbt_docs to prodocution environment when you and your team can check those 2 usefull reports.

This introduction assumes you are using dbt and optionally re_data.


## Install re_cloud package

**re_cloud** package is small python package for uploading data reports files to re_cloud 😊

```bash
pip install re_cloud
```

## Configure your API key

In the `Account Settings` section of the re_cloud, you can find your API key, which will be used for uploading data.

![DashboardExample](/screenshots/cloud/getapikey.png)

Than paste this into your `~/.re_data/re_data.yml` configuration file. (For simplicity we use the same directory and file as you would use for *re_data* package configuration)

```yml title="~/.re_data/re_data.yml"

re_cloud:
  api_key: YOUR_KEY_HERE
```

## Generate reports

If you didn't yet generated dbt docs and re_data reports you can do it now. `cd` to your dbt project catalog and run:

```bash
dbt docs generate
re_data overview generate
```

:::info
This requires you to have `re_data` configured in your environment!
If you don't and you don't need to configure it now.
Just skip re_data parts of the rest of tutorial.
:::

## Upload reports! 😊

Now with just 2 commands we can upoad our reports to cloud

```bash
re_cloud upload dbt-docs
re_cloud upload re-data
```

## View them in the cloud

Now you cloud account should contain 2 additional reports with recent upload times.

![DashboardExample](/screenshots/cloud/start_dashboard.png)


re_cloud supports uploading a couple of different reports, let's check all of them 😊 