---
sidebar_position: 5
---

# Deployment 🚀

### Running re_cloud on production

re_data is designed to fit into existing workflows and can be run in many different ways. We will describe here the 2 which in our perspective are the most common.

## re_cloud run on Airflow, Prefect, or other orchestration tools

If you are using any of the popular orchestration tools, we advise you to create a new job that will run re_cloud push after the dbt docs, re_data, and great-expectations docs were created.

All orchestration tools allow you to quite easily run bash commands. The most important thing here is to make sure `re-cloud` is actually available in the orchestration tool's environment. You can easily install re_cloud even in the same command running it by using `pip install re-cloud`.

## re_cloud (and possibly dbt, re_data, others) run in Github Actions

This is the way we run `re_cloud`. We are using it on our analytics repo code which you can actually check out **[HERE](https://github.com/re-data/analysis)**.

The most interesting part of it is the Github Actions which is running our whole setup, you can check **[github action file here](https://github.com/re-data/analysis/blob/main/.github/workflows/re_data.yml)** 

One thing to notice is how to quickly point re_cloud to the configuration file without making them part of the repo.
re_data support variable `RE_DATA_CONFIG_DIR` which can be used to point to a directory where your configuration files are stored. This way is very similar to dbt's `DBT_PROFILES_DIR` env variable, which we are, by the way, also using.

Lastly, we are using `yq` to fill the proper values in our configuration files (from GitHub secrets) while running the commands.

#### More questions?

Having more questions about this, join our **[Slack! 😊](https://www.getre.io/slack)** and let us know!
