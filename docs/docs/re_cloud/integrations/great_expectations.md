---
sidebar_position: 3
---

# great-expectations

## Overview

Great expectations let's you test & document your data. 
It supports many computation backends from pandas, spark to databases like snowflake.

On some level great-expectations competes with `dbt test` functionality.

One cool feature of great-expectations is ability to generate data docs which describe your data & tests run.

Below example of how generated great_expectations docs look like when uploaded to re_cloud:

![great_expectations_example](/re_cloud/integrations/great_expectations.png)

## Uploading to re_cloud

Great-expectations data docs, are most usefull when shared with others. That's why we made is easily possible to send them to `re_cloud` and collobarote on the results with other people.

To upload great_expectations docs to re_cloud `cd` to you GE folder with data docs generated and run upload command:

```
cd YOUR_GE_FOLDER
re_cloud upload great-expectations
```

## re_cloud command

Below we show all the currently supported options on how you can upload great-expectations to `re_cloud`

```
re_cloud upload great-expectations --name TEXT 

Options:
  --channel-name-or-id TEXT  The slack channel name to send the report
                             uploaded message if a slack account is connected
                             to the re_cloud account. It could be a channel
                             name, channel id or member id.
  --name TEXT                Name of the upload used for identification
  --config-dir TEXT          Path to the directory containing re_data.yml
                             config file
  --path TEXT                path to the directory containing or files to push
                             to re_cloud
  --help                     Show this message and exit.
```

## Next steps

If you would like to jump into uploading data you can create your **[free account here 😊](https://cloud.getre.io/#/register)** if you have more questions for us: don't be reluctant to join our **[Slack! 😊](https://www.getre.io/slack)**
