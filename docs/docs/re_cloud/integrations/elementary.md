---
sidebar_position: 3
---

# Elementary

## Overview

Elementary is library which allows you to monitor your data quality in a simple way. Similarly to re-data open-source it's targeting primarly dbt users.

![great_expectations_example](/re_cloud/integrations/elementary.png)

## Uploading to re_cloud

To upload elementary report to re_cloud `cd` to you dbt folder. Assuming you already created elementary report, the report data should be in `edr_target/elementary_report.html` file. 

```
cd DBT_PROJECT_FOLDER
re_cloud upload elementary
```

## re_cloud command

Below we show all the currently supported options on how you can upload elementary to `re_cloud`

```
re_cloud upload elementary --name TEXT 

Options:
  --file TEXT                path to the elementary_report.html file, normally
                             it's in edr_target directory of dbt project and
                             this is what we set as default
  --config-dir TEXT          Path to the directory containing re_data.yml
                             config file
  --name TEXT                Name of the upload used for identification
  --channel-name-or-id TEXT  The slack channel name to send the report
                             uploaded message if a slack account is connected
                             to the re_cloud account. It could be a channel
                             name, channel id or member id.
  --help                     Show this message and exit.
```

## Next steps

If you would like to jump into uploading data you can create your **[free account here 😊](https://cloud.getre.io/#/register)** if you have more questions for us: don't be reluctant to join our **[Slack! 😊](https://www.getre.io/slack)**
