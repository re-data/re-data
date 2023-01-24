---
sidebar_position: 5
---

# Deployment 🚀

### Running re_data on production

re_data is designed to fit into existing workflows and can be run in many different ways. We will describe here the most common ways of running re_data in production.

In most cases, you would like to run re_data in the same place where your dbt models are run. That's why we will suggest you couple of options depending on how you are running dbt yourself.

## run dbt on Airflow, Prefect, or other orchestration tools

If you are using any of the popular orchestration tools, we advise you to create a new job that will run re_data after your dbt runs. This way you can be sure that re_data will be run after your dbt models are refreshed.

All of the orchestration tools allow quite easily run bash commands. The most important thing here is to make sure `re-data` is actually available in the orchestration tool's environment. You can easily install re_data even in the same command running it by using `pip install re-data`.

## run dbt in dbt cloud

If you are running dbt in the dbt cloud, there are two options you can use to run re_data.
Firstly `re-data` is a dbt package and as such can be run in the dbt cloud by running a command

```
 dbt run --select package:re_data
```

This can compute all the backend models of re_data in your dbt cloud environment.

Unfortunately, it's not possible to run the `re_data run` command directly in the dbt cloud, for this reason, if you want to generate `re-data` UI we are recommending you set up a Github Action which will run `re_data overview` command. This is the way we are running re_data (and dbt) ourselves, and we are happy to share our setup with you.

## re_data (and possibly dbt) run in GitHub Actions

As mentioned this is how we are running dbt and re_data, and re_cloud ourselves so that it can be considered our favorite :) We recently make our analysis repo public so you can see easily see and copy all the setup required for running dbt and re_data this way. You can check out the repo: **[HERE](https://github.com/re-data/analysis)**.
The most interesting part of it is the GitHub Actions which is running our whole setup, you can check our **[github action file here](https://github.com/re-data/analysis/blob/main/.github/workflows/re_data.yml)** 

One thing to notice is how to easily point re_data to the configuration file without making them part of the repo.
re_data support variable `RE_DATA_CONFIG_DIR` which can be used to point to a directory where your configuration files are stored. This way is very similar to dbt's `DBT_PROFILES_DIR` env variable, which we are also using.

Lastly, we are using `yq` to fill the proper values in our configuration files (from GitHub secrets) at the time of running the commands.

#### More questions?

Having more questions about this, join our **[Slack! 😊](https://www.getre.io/slack)** and let us know!
