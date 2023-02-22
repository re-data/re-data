
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
  --file TEXT  ipynb notebooks file to upload  [required]
  --name TEXT  Name of the upload used for identification
  --help       Show this message and exit.
```