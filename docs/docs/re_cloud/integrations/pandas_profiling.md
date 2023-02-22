---
sidebar_position: 5
---
# pandas-profiling

## Overview

Pandas-profiling is a python library which can you help you profile any pandas dataframe.
It will automatically generate insights about:
 - each of your columns 
 - correlations between them
 - missing values
 - alerts

in your dataframe data.

You can think of it as a extension of pandas native [describe command](https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html)

Pandas profiling report is most often saved to HTML file to be inspected by data team and potentially data consumers. Below view of the example pandas-profiling output:

![pandas_profiling_example](/re_cloud/integrations/pandas_profiling.png)


## Uploading to re_cloud

To collaborate on your pandas-profiling reports, you can easily upload it to re_cloud.
Generating pandas profiling report is really easy:


```python
from pandas_profiling import ProfileReport
...
profile = ProfileReport(df, title="Pandas Profiling Report")
profile.to_file("report.html")
```

Once generated you can upload report to the cloud:

```
re_cloud upload pandas-profiling --report-file report.html
```


## re_cloud command

Below we show all the currently supported options on how you can upload pandas-profiling to `re_cloud`

```
re_cloud upload pandas-profiling --name TEXT  --report-file TEXT

Options:
--report-file TEXT  Pandas profiling file with html report  [required]
--name TEXT         Name of the upload used for identification
```

For pandas profiling --report-file is required paramter. re_data will upload your docs in `uncommitted/data_docs/local_site/` path then.


## Next steps

If you would like to jump into uploading data you can create your **[free account here 😊](https://cloud.getre.io/#/register)** if you have more questions for us: don't be reluctant to join our **[Slack! 😊](https://www.getre.io/slack)**
