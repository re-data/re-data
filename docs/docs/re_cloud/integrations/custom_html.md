---
sidebar_position: 6
---

# Custom HTML

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

with open("summary.html", 'w') as f:
    f.write(text)
```

Once generated you can upload report to the cloud:

```
re_cloud upload custom --file summary.html
```

## re_cloud command

Below we show all the currently supported options on how you can upload custom html to `re_cloud`

```
Usage: re_cloud upload custom --name TEXT  --file TEXT

Options:
  --file TEXT  custom html file to upload  [required]
  --name TEXT  Name of the upload used for identification
  --help       Show this message and exit.
```

## Next steps

If you would like to jump into uploading data you can create your **[free account here 😊](https://cloud.getre.io/#/register)** if you have more questions for us: don't be reluctant to join our **[Slack! 😊](https://www.getre.io/slack)**
