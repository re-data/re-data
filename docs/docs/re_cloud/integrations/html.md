---
sidebar_position: 6
---

# HTML file

## Overview

If you have details about your data that you want to share with your team, custom html report maybe the best way to do it.

Some tools allows you to export HTML summary of you data. For example [pandas to_html command](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.to_html.html) let's you export information about your dataframe to HTML file.

Example summary of your dataframe data you can upload:

![custom_html_example](/re_cloud/integrations/custom_html.png)

## Uploading to re_cloud

Let's upload summary of pandas dataframe to re_cloud
```python
df = pd.DataFrame(np.random.rand(100, 5), columns=["a", "b", "c", "d", "e"])
text = df.to_html()

with open("index.html", 'w') as f:
    f.write(text)
```

Once generated you can upload report to the cloud:

```
re_cloud upload html-file --file index.html
```

:::caution
Currently html file uploaded to re_cloud should be called `index.html` so if you have a different name you should rename it before uploading and we recommend to use --name option to give your upload a name of the file.
:::

## re_cloud command

Below we show all the currently supported options on how you can upload custom html to `re_cloud`

```
Usage: re_cloud upload html-file --name TEXT  --file TEXT

Options:
  --channel-name-or-id TEXT  The slack channel name to send the report
                             uploaded message if a slack account is connected
                             to the re_cloud account. It could be a channel
                             name, channel id or member id.
  --name TEXT                Name of the upload used for identification
  --config-dir TEXT          Path to the directory containing re_data.yml
                             config file
  --file TEXT                a file with give upload type  [required]
  --help                     Show this message and exit.
```

## Next steps

If you would like to jump into uploading data you can create your **[free account here 😊](https://cloud.getre.io/#/register)** if you have more questions for us: don't be reluctant to join our **[Slack! 😊](https://www.getre.io/slack)**
