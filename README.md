# Redata
Monitoring system for data teams.
Computing health checks on data (via Airflow jobs), visualizing them over time, and alerting on them in Grafana.

Currently in early development stage for now it was tested with Python 3.8.5 and PostgreSQL.
Other DBs and data sources, features like generated Grafana alerts, custom checks are to be added.


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

# Benefits over doing monitoring yourself
Grafana supports PostgreSQL and lot of others DBs, so what are benefits of using redata over setting monitoring yourself with couple of SQL queries?
Here is a our list :)

 * **Visualizing all tables together in one dashbard** - Computing metrics layer make it really easy to do visulizations for many/all tables at once and showing them under one dashboard.
 
 * **Visualizing things normally not possible** - Things like schema changes, cannot be queried from DB, but computing metrics over time makes showing those possible.
 
 * **Visualizing how things change over time** - If you are doing any updates to DB, like updating row status etc. it's impossible to visualize how things looked liked in the past and compare it to now (for alerting purposes etc.), adding metrics layer makes it easy.
 
 * **Automatic dashboards** - Last but not least it's normally quite cumbersome to setup proper monitoring for all tables and keeping it up to date is hard - redata can do that for you, detecting new tables and columns and automatically creating dashboards/panels for them.

Here are some examples of how generated Grafana dashboards look like:

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

* [Slack](https://join.slack.com/t/redatahq/shared_invite/zt-jk8imy5f-OPjSHv7fCpfYUGyktw_qvw) For general questions about using redata, problems and discussions with people making it :)



# License
Redata is licensed under the MIT license. See the [LICENSE](LICENSE) file for licensing information.
