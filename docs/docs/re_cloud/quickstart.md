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

![DashboardExample](/re_cloud/flows/getapikey.png)

Then paste this into your `re_data.yml` configuration file. You can create this file anywhere on your system. 
re_cloud has default location where it's looking for in home directory `.re_data` folder. (`~/.re_data/re_data.yml` for file path re_cloud used as default)

```yml title="re_data.yml"
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
re_cloud upload dbt-docs --config-dir /path/to/re_data_yml_dir
re_cloud upload re-data --config-dir /path/to/re_data_yml_dir
```

In case you stored your `re_data.yml` in the default location you can skip `--config-dir` flag.

## View them in the cloud

Now you cloud account should contain 2 additional reports with recent upload times. Something like this:

![DashboardExample](/re_cloud/flows/dashboard.png)


re_cloud supports uploading a couple of different reports, let's check all of them 😊 

## Invite your team

Inviting your team is super easy, just click on the `Invite` button in the top right corner and add emails of your team members.


![DashboardExample](/re_cloud/flows/invite.png)

## Configuring slack notifications

If you would like to configure slack notifications for your reports, you can do it in the `Account Settings` section of the re_cloud.

![DashboardExample](/re_cloud/flows/slack.png)


## View reports history

Let's update our reports again and see how it looks like in the cloud


```bash
re_cloud upload dbt-docs --config-dir /path/to/re_data_yml_dir
re_cloud upload re-data --config-dir /path/to/re_data_yml_dir
```

Now you should be able to see something like this in your dbt docs or re_data reports:

![DashboardExample](/re_cloud/flows/history.png)

## Next steps

Now you can start using re_cloud to share your reports with your team and business users. If you would like to learn more joing our **[Slack! 😊](https://www.getre.io/slack)** community or check the rest of our docs!
