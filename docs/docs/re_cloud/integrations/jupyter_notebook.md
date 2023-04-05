---
sidebar_position: 4
---
# Jupyter notebook

## Overview

Jupyter notebooks are super common way to work with data. There are couple of online tools for editing notebooks, currently focuses on supporting orginal 🙂 open-source python library and sharing results of your notebooks with other people in the company. re_cloud allows you to transform your jupyter notebooks to HTML and easily share with others.

![jupyter_notebook_example](/re_cloud/integrations/jupyter_notebook.png)

## Uploading to re_cloud

In order to upload jupyter notebook to re_cloud run:
```
re_cloud upload jupyter-notebook --file your_notedbook_file

```

## re_cloud command

Below we show all the currently supported options on how you can upload jupyter-notebook to `re_cloud`

```
Usage: re_cloud upload jupyter-notebook --name TEXT  --file TEXT

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