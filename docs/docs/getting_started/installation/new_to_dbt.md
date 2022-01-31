---
sidebar_position: 2
---

# Installation for starters

You are not using dbt (yet?) in your company but would like to try to re_data


**Excellent choice!** re_data can help you with data quality and is a good way to start using dbt in your organization, even if you are: not yet ready to switch, or happy with the current way of transforming data. 

## Install re_data package

For new users we recommend installing re_data package:

```bash
pip install re_data
```

re_data includes dbt in dependencies so after this step you will already have it installed in your system.

## Init your dbt project

Then you can initialize your dbt project with:

```bash
re_data init project_name
```

## Setup you db connection

Dbt stores connection details for you db in `~/.dbt/profiles.yml`. Example setup for postgres below:

```yml title=~/.dbt/profiles.yml
project_name:
  target: dev
  outputs:
    dev:
      type: postgres
      host: xxx
      user: xxx
      password: xxx
      port: 5432
      dbname: xxx
      schema: project_name
      threads: 4
```

More details on how to set up a profile file for your DB can be found in [dbt docs](https://docs.getdbt.com/dbt-cli/configure-your-profile)

## You are done

You are done, check out next chapter about example data quality project.