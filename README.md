# redata
Monitoring system for data engineers/data scientists.
Computing health checks on data (via Airflow jobs), visualizing, and alerting on them in Grafana.

Currently in early development stage, tested and should work for monitoring postgresql data.
Other DBs, redshift, bigquery, s3, coming in the future.

# Getting started

```

git clone https://github.com/redata-team/redata.git
docker-compose up

# add env variable with DB url to observe
# export REDATA_SOURCE_DB_URL=postgres://DB_USER:DB_PASSWORD@HOST_NAME:5432/DB_NAME

python redata.py --tables # create observed tables DB, edit active tables in redata DB if don't want stats for all tables
python redata.py --metrics # compute first metircs for you DB
python redata.py --grafana # generate grafana dashboards for your metrics

```

And metrics should be ready to look at in your grafana :)
Visit http://localhost:3000 to check them (or docker IP in case of using docker via virtulbox)

Visia http://localhost:8080 to check airflow jobs that are running, coputing DB metrics every 10 minutes.
