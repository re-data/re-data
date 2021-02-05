# Redata
Monitoring system for data teams.
Computing health checks on data (via Airflow jobs), visualizing them over time, and alerting on them in Grafana.


# Key features

## Metrics layer

Redata computes health metrics for your data, containing information like this:

* time since last record was added
* number of records added in last (hour/day/week/month)
* schema changes that recently happened
* number of nulls in columns over time
* other checks specific to columns in data and their types

*If you have DevOps experience, you can think of it as: prometheus, telegraf for data teams*

## Automatic dashboards

Having metrics in one common format, makes it possible to create dashboards automatically, for all (or chosen) tables
in your data. Currently there are 2 types of dashboard redata creates:
* home dashboard, containing most important information about all tables
* table dashboard, containing information specific to given table and columns in it

Here are some examples of how generated Grafana dashboards look like:

<img src="./docs/static/home.png" width="80%"></img>
<br>
*Get a glimpse of what's happening in all your tables on one screen. If you see, any suspicious numbers click on the tile for more details on this specific table.* 

<img src="./docs/static/per_table.png" width="80%"></img>
<br>
*Get an in-depth view of your table, learn about any schema changes, volume fluctuations, nulls in columns, and other useful metrics.*

## Smart alerts

Redata compares metrics computed in the past to current metrics and alerts if anomalies are found. This means that situations like this:
 * sudden drops or increases in the volume of new records added to your tables
 * longer than expected break between data arrivals
 * significantly different maximal/minimal/avg numbers in any of table columns
 * and more

Would be detected, and you will be alerted. Redata supports Slack (with others tools possible to integerate for you via Grafana) so you can also set up alerts to your favorite support channel.

## Batteries included

No need to setup Airflow, Grafana or DB for storing metrics. Redata will setup all of those via Docker images, you need to deploy only one thing.
Check out deplying on production section for info how to easily deploy redata on AWS or GCP.

# Benefits over doing monitoring yourself
Grafana supports PostgreSQL and lot of others DBs, so what are benefits of using redata over setting monitoring yourself with couple of SQL queries?
Here is a our list :)

 * **Visualizing all tables together in one dashbard** - Computing metrics layer make it really easy to do visulizations for many/all tables at once and showing them under one dashboard.
 
 * **Visualizing new, previously impossible things** - Things like schema changes, cannot be queried from DB, but computing metrics over time makes showing those possible.
 
 * **Visualizing how things change over time** - If you are doing any updates to DB, like updating row status etc. it's impossible to visualize how things looked liked in the past and compare it to now (for alerting purposes etc.), adding metrics layer makes it easy.
 
 * **Automatic and up to date dashboards** - It's normally quite cumbersome to setup proper monitoring for all tables and keeping it up to date is hard - redata can do that for you, detecting new tables and columns and automatically creating dashboards/panels for them.
 
 * **Smart alerts** - Once tables are detected redata automatically tracks their health and looks for anomalies there. It's hard to do that alerting yourself and scalling it for all tables requires even more effort.

# Getting started (local machine setup)

```
git clone https://github.com/redata-team/redata.git
cp env_template .env

# create REDATA_SOURCE_DB_URL_YOUR_DB_NAME variables (at the end of .env file)
# you can add multiple variables for many DBs you want to observe here

# if just want to test redata, without your data yet, just paste
# REDATA_SOURCE_DB_URL_REDATA=${REDATA_METRICS_DB_URL}
# as url, you will starting with monitoring redata itself :)

docker-compose up
```

## Grafana
Add this point Grafana should be running on http://localhost:3000 (or you docker IP in case of running docker via virtualbox)

First screen you will see there, is login screen. Default password is admin/mysecretpassword, but if you want can you can change that in .env file (need to be done when staring docker)

From the main dashboard named: `Home (generated)` you can go to any table specific dashboard, just by clicking tile that shows stats for given table

## Airflow
Airflow should be running and available under: http://localhost:8080/ (or you docker IP, default password is also admin/admin if it wasn't changed in .env)

You should see `validation dag` there, turn in on and it will start running (every 10 minutes or other frequency if specified in `settings.py` file)

You can also manually trigger running dag (by clicking first icon on Link tab)


# Deploying on production

Redata uses `docker` and `docker-compose` for deployment, this makes it easy to deploy in the cloud, or in your on premise enviroment. 

Look at sample setup instructions for specfic cloud providers:

 - [AWS EC2 deployment](deployment/aws_ec2_awslinux/deployment.md),
 - [AWS Fargate via Pulumi](deployment/pulumi_aws_fargate/README.md),
 - [GCP Compute Engine deployment](deployment/gcp_compute_engine_debian/deployment.md)

# Community

Join [Slack](https://join.slack.com/t/redatahq/shared_invite/zt-lrp4khvb-kIS6ct4WzJTy~JNVzwB5yw) for general questions about using redata, problems, and discussions with people making it :)


# Integrations

Here are integrations we support or work on now. Let us know if you'd really like to pritize something or your DB is not included on the list.

<table>
	<thead>
		<tr>
			<th colspan="2">Integration</th>
			<th>Status</th>
		</tr>
	</thead>
	<tbody>
		<tr><td><img height="40" src="https://wiki.postgresql.org/images/3/30/PostgreSQL_logo.3colors.120x120.png" /></td><td style="width: 200px;"><a href="https://www.postgresql.org/">PostgreSQL</a></td><td>Supported</td></tr>
		<tr><td><img height="40" src="https://www.mysql.com/common/logos/powered-by-mysql-167x86.png" /></td><td style="width: 200px;"><a href="https://www.mysql.com/">MySQL</a></td><td>Supported</td></tr>
		<tr><td><img height="40" src="./docs/static/Exasol_clean_navy.png" /></td><td style="width: 200px;"><a href="https://www.exasol.com/">Exasol</a></td><td>Supported</td></tr>
		<tr><td><img height="40" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSVBiUjawSeBBj7T2v64nKYk7SWuLQ3g1vugg&usqp=CAU" /></td><td style="width: 200px;"><a href="https://cloud.google.com/bigquery">BigQuery</a></td><td>Supported</td></tr>
		<tr><td><img height="40" src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/de/AirflowLogo.png/320px-AirflowLogo.png" /></td><td style="width: 200px;"><a href="https://airflow.apache.org/">Apache Airflow</a></td><td>Supported, view all your checks in Airflow </td></tr>
		<tr><td><img height="40" src="https://upload.wikimedia.org/wikipedia/en/thumb/a/a1/Grafana_logo.svg/125px-Grafana_logo.svg.png" /></td><td style="width: 200px;"><a href="https://grafana.com/">Grafana</a></td><td>Supported, view metrics here</td></tr>
		<tr><td><img height="40" src="https://assets.brandfolder.com/pl546j-7le8zk-btwjnu/v/2925183/view@2x.png?v=1610642000" /></td><td style="width: 200px;"><a href="https://slack.com/">Slack</a></td><td>Supported, get alerts on Slack</td></tr>
		<tr><td><img height="40" src="https://www.sqlalchemy.org/img/sqla_logo.png" /></td><td style="width: 200px;">Other SQL DBs</td><td>Experimental support via using SQLAlchemy</td></tr>
		<tr><td><img height="40" src="https://www.blazeclan.com/wp-content/uploads/2013/08/Amazon-Redshift-%E2%80%93-11-Key-Points-to-Remember.png" /></td><td style="width: 200px;">AWS Redshift</td><td>In development</td></tr>
		<tr><td><img height="40" src="https://braze-marketing-assets.s3.amazonaws.com/images/partner_logos/amazon-s3.png" />   </td><td style="width: 200px;">AWS S3</td><td>In development</td></tr>
  		<tr><td><img height="40" src="https://static.wikia.nocookie.net/logopedia/images/7/7f/Microsoft_Office_Excel_%282018%E2%80%93present%29.svg/revision/latest/scale-to-width-down/52?cb=20190927105356" />   </td><td style="width: 200px;">Excel</td><td>Planned</td></tr>
		<tr><td><img height="40" src="https://www.snowflake.com/wp-content/themes/snowflake/img/snowflake-logo-blue@2x.png" /> </td><td style="width: 200px;">Snowflake</td><td>Planned</td></tr>
	</tbody>
</table>


# License
Redata is licensed under the MIT license. See the [LICENSE](LICENSE) file for licensing information.


# Contributing

We love all contributions, bigger and smaller.

Checkout our list of [good first issues](https://github.com/redata-team/redata/issues?q=is%3Aissue+is%3Aopen+label%3A%22good+first+issue%22) and see if you like anything from there. Also feel welcome to join our [Slack](https://join.slack.com/t/redatahq/shared_invite/zt-lrp4khvb-kIS6ct4WzJTy~JNVzwB5yw) and suggest ideas, or setup no pressure session with Redata [here](https://calendly.com/mateuszklimek/30min). 

More details on how to tests your changes under: [CONTRIBUTING](https://github.com/redata-team/redata/blob/master/CONTRIBUTING.md)
