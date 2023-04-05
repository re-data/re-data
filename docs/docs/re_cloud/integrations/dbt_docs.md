---
sidebar_position: 1
---


# dbt docs

## Overview

Dbt docs help you share documentation about your data with your team and other shareholderes in the company.

You can generate dbt docs from your dbt project. Dbt allows you also to add descriptions to each of the tables, columns, macros.

Below example of how generated documentation looks like when uploaded to re_cloud:

![dbt_docs_example](/re_cloud/integrations/dbt_docs.png)

More information on generating dbt docs is available on [dbt pages](https://docs.getdbt.com/docs/building-a-dbt-project/documentation)

## Uploading to re_cloud

In order to effectively work with dbt docs it's crucial to share it with other people in the company.
re_cloud makes it super easy. The simplest way to do it is to run commands below in your dbt project:


```
dbt docs generate
re_cloud upload dbt-docs
```

## re_cloud command 

Below we show all the currently supported options on how you can upload dbt-docs to `re_cloud`

```
re_cloud upload dbt-docs --name TEXT --project-dir TEXT

Options:
  --channel-name-or-id TEXT  The slack channel name to send the report
                             uploaded message if a slack account is connected
                             to the re_cloud account. It could be a channel
                             name, channel id or member id.
  --name TEXT                Name of the upload used for identification
  --config-dir TEXT          Path to the directory containing re_data.yml
                             config file
  --project-dir TEXT         Which directory to look in for the
                             dbt_project.yml file. Default is the current
                             working directory and its parents
  --help                     Show this message and exit.
```

You don't need to pass project-dir paramter if calling this command from witin dbt main directory. Otherwise pass `project-dir` to upload generated docs from this directory.

## Next steps

If you would like to jump into uploading data you can create your **[free account here 😊](https://cloud.getre.io/#/register)** if you have more questions for us: don't be reluctant to join our **[Slack! 😊](https://www.getre.io/slack)**
