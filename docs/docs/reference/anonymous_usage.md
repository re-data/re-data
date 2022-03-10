---
sidebar_position: 6
---


# Anonymous usage

In order to catch problems early, understand how users are using `re_data` and improve our product `re_data` captures anonymous information about command-line usage. We track only the most important information and don't track any table names, metric names, etc. Here are a sample requests we are getting to our systems.

## Sample events

```
    'command': 'run',
    'dbt_version': '1.0.3',
    'end_date': '2021-01-02T00:00:00.000Z',
    'interval': 'days:1',
    'os_system': 'Darwin',
    'profile': null,
    'python_version': '3.9.9',
    're_data_version': '0.6.2',
    'start_date': '2021-01-01T00:00:00.000Z',
    'status': 'start',
    'target': null
```

In case of an exception happening when running `re_data` we will also get a type of exception:

```
    'command': 'run',
    'dbt_version': '1.0.3',
    'end_date': '2021-01-02T00:00:00.000Z',
    'error': '<class \'subprocess.CalledProcessError\'>',
    'interval': 'days:1',
    'os_system': 'Darwin',
    'profile': null,
    'python_version': '3.9.9',
    're_data_version': '0.6.2',
    'start_date': '2021-01-01T00:00:00.000Z',
    'status': 'exception',
    'target': null
```

## Opt out

If you would like to opt out of anonymous usage collection set `RE_DATA_SEND_ANONYMOUS_USAGE_STATS=0` in your environment. You can do it before or togather with `re_data` command call like this:

```
RE_DATA_SEND_ANONYMOUS_USAGE_STATS=1 re_data overview generate
```