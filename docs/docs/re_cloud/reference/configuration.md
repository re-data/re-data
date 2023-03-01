---
sidebar_position: 0
---

# Configuration

## re_cloud command line common arguments

re_cloud upload command used when uploading all the data reports, support set of common arguments available for all types of uploads.

### --name

Name of the upload used for identification

This is the name of the upload that will be used for identification in re_cloud. If you don't pass this argument, re_cloud will use the type of the upload as the name, but we recommend you to pass it explicitly.

This allows you to easily distinguish between different uploads of the same type which is often needed.

### --config-dir 

Path to the directory containing re_data.yml

This is the argument you should use if you are not storing your re_data.yml file in the default location.
Just pass the path to the directory where your re_data.yml file is stored.

### --channel-name-or-id 

 The slack channel name to send the report uploaded message if a slack account is connected to the re_cloud account. It could be a channel name, channel id or member id.

 This arguments allows you to specify the slack channel where you want to receive the message about the upload. If you don't pass this argument, the message will be sent to the default slack channel which was set in re_cloud account UI.

![DashboardExample](/re_cloud/flows/slack_config.png)

Screenshot of UI configuration of the default slack channel. 



