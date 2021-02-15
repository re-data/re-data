
## Running redata in dev mode

To be able to test changes you made in Redata, you will need to run it in dev mode.
This way your changes will be used to generate metrics and dashboards.

Setup is pretty the same, as for testing it in local mode, just use different docker-compose file to run it.

```
git clone https://github.com/redata-team/redata.git

cp env_template .env
# create REDATA_SOURCE_DB_URL_YOUR_DB_NAME variables (at the end of .env file)
# you can add multiple variables for many DBs you want to observe here

docker-compose -f docker-compose.dev.yml up
```

This way, your docker is using your version of code. You don't need to restart docker to changes to take affect.

In this mode you can also manually trigger couple important actions on Redata:


```
./redata-dev.sh --grafana
# Generates dashboards in grafana, based on metrics gathered

./redata-dev.sh --metrics
# Computes metrics for tables

./redata-dev.sh --tables
# Creates internal tables for redata metrics

./redata-dev.sh --generate-sample-data
# Generates sample data to observe, with 30 day history to properly test alerts

./redata-dev.sh --backfill X
# Run backfill from X days ego and compute daily metrics on tables
```

This enable you to quickly check if changes you made are working correctly.

## Before pull request

Before making pull request, assuming you are changing code (not docs only).
It would be usefull for run:

```
docker-compose down
docker-compose -f docker-compose.dev.yml up
```

This will delete docker containers created and restart them from scratch using your code changes.
If after that, grafana metrics are computed you are ready to make PR.

Ps. We will soon add tests to make contributing and developing easier, for now treat starting docker and seeing no errors as tests ;)

