---
sidebar_position: 2
---

# Quickstart

In this quick tutorial we will deploy the UI of re_data & dbt_docs to production environment when you and your team can check those 2 usefull reports. This introduction assumes you are using dbt and optionally also use re_data


## Install re_cloud package

To upload reports you will need to install `re_cloud` python package, you can easily to it with pip

```bash
pip install re_cloud
```

## Configure your API key

In the `Account Settings` section of the re_cloud, you can find your API key, which will be used for uploading data.

![DashboardExample](/screenshots/cloud/getapikey.png)

Then paste this into your `~/.re_data/re_data.yml` configuration file. (For simplicity we use the same directory and file as you would use for *re_data* package configuration)

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
This commands require you to have dbt & re_data configured for the project. In case you just use dbt docs not re_data you can skip the second command. If you don't use any of it, check our instructions other tools we support.
:::

## Upload reports! 😊

Now with just 2 commands we can upload our reports to cloud

```bash
re_cloud upload dbt-docs
re_cloud upload re-data
```

## View them in the cloud

Now you cloud account should contain 2 additional reports with recent upload times.

![DashboardExample](/screenshots/cloud/start_dashboard.png)


re_cloud supports uploading a couple of different reports, let's check all of them 😊 