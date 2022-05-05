---
sidebar_position: 3
---

# Notify

`re_data notify` command is used to send notifications relating to re_data alerts.

### slack
```bash
re_data notify slack \
--start-date 2021-01-01 \
--end-date 2021-01-31 \
--webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX \
--subtitle="[Optional] Markdown text to be added as a subtitle in the slack message generated"
```

Running this command would generate a slack message from the alerts re_data detected.

- Supported arguments:
    - start-date (default: today - 7 days) - start date of the period for which you want to generate alerts
    - end-date (default: today) - end date of the period for which you want to generate alerts
    - webhook-url - [incoming webhook](https://api.slack.com/messaging/webhooks) gotten from a slack app.
    - subtitle (optional) - extra markdown text passed to the generated message. Often used to add some more context to the message generated.
    - dbt-vars - This accepts a valid YAML dictionary as string which is passed down to the dbt command using [--vars](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/using-variables).
- Dbt supported arguments:
  - profile - Which profile to load. Overrides setting in dbt_project.yml.
  - target - Which target to load for the given profile.
  - project-dir - Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.
  - profiles-dir - Which directory to look in for the profiles.yml file. Default = ~/.dbt.


### email
```bash
re_data notify email \
--start-date 2021-01-01 \
--end-date 2021-01-31
```

Running this command would generate a slack message from the alerts re_data detected.

- Supported arguments:
    - start-date (default: today - 7 days) - start date of the period for which you want to generate alerts
    - end-date (default: today) - end date of the period for which you want to generate alerts
    - dbt-vars - This accepts a valid YAML dictionary as string which is passed down to the dbt command using [--vars](https://docs.getdbt.com/docs/building-a-dbt-project/building-models/using-variables).
- Dbt supported arguments:
  - profile - Which profile to load. Overrides setting in dbt_project.yml.
  - target - Which target to load for the given profile.
  - project-dir - Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents.
  - profiles-dir - Which directory to look in for the profiles.yml file. Default = ~/.dbt.
