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
      version: [">=0.2.0", "<0.3.0"]

```

And run:

```
dbt deps
```

## Optionally

Optionally you can install re_data python package, which simplifies running some dbt commands related to re_data models.

```
pip install re_data
```

We will talk more about this in the Getting started tutorial