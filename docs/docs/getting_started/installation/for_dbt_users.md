---
sidebar_position: 1
---

# Installation for dbt users

If you are already using dbt in your company, you can install re_data by adding our dbthub package to your project.

## Adding re_data to packages used

Simply update your `packages.yml` file with re_data package

```yml title="packages.yml"

packages:
    ***
    
    - package: re-data/re_data
      version: [">=0.5.0", "<0.6.0"]

```

And run:

```
dbt deps
```

## Adding re_data python package for observability UI

To generate re_data observability UI you need to install re_data python packge. You can do it simply like that:

```
pip install re_data
```