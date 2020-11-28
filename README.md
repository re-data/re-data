# Redata
Monitoring system for data teams.
Computing health checks on data (via Airflow jobs), visualizing, and alerting on them in Grafana.

Currently in early development stage, tested and should work for monitoring postgresql data.
Other DBs, redshift, bigquery, s3, coming in the future.

# Introduction
Redata helps data teams, monitor if data they are producting and data they are depending on is correct.
It gathers metrics on your data as:

* time since last record was added
* number of records added in last (hour/day/week/month)
* schema changes that recently happened
* number of nulls in columns over time
* other checks specific to columns in data and their types

And later on makes those metrics visible under autmatically generated
grafana dashboards.

<img src="./docs/static/home.png" width="80%"></img>
<img src="./docs/static/per_table.png" width="80%"></img>

# Getting started (local machine setup)

```

git clone https://github.com/redata-team/redata.git
cp env_template .env
# change REDATA_SOURCE_DB_URL (last variable) in .env for URL to DB you would like to monitor

docker-compose up

pip install -e .
source .env.local

redata --tables # create tables for redata
redata --metrics # compute first metircs for you DB
redata --grafana # generate grafana dashboards for your metrics

```

And metrics should be ready to look at in your grafana :)
Visit http://localhost:3000 to check them (use docker IP in case of using docker via virtulbox)

Visit http://localhost:8080 to check airflow jobs, turn on dag in airflow, so that checks run every 10 minutes.

# Community

* [Slack](https://redatahq.slack.com/) For general questions about using redata, problems and discussions with people making it :)



# License
Redata is licensed under the MIT license. See the [LICENSE](LICENSE) file for licensing information.
