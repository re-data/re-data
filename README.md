<p align="center">
<a href="http://redata.team/slack"><img alt="Slack" src="https://img.shields.io/badge/chat-slack-blue.svg"/></a>
<img alt="License" src="https://img.shields.io/github/license/redata-team/redata?color=violet"/>
<img alt="Last commit" src="https://img.shields.io/github/last-commit/redata-team/redata"/>
</p>

# re_data

re_data is tool for improving data quality in your organization, build on top of [dbt](https://github.com/fishtown-analytics/dbt).

* create data quality project for your organization to monitor and improve quality of your data,
* compute data quality metrics for all your tables and add your own code computing those,
* look for anomalies in all your metrics and investigate problematic data

# Key features

## Data quality metrics
re_data creates data quality metrics schema in your data warehouse containg metrics for all your tables (or only those you would like to monitor)
Metrics schema contains information about:

* time since last records were added
* number of records added
* number of missing values in columns over time
* min/max/avg of values in all your columns
* string lengths in all your columns

Think about it as a `INFORMATION_SCHEMA` on steroids :muscle:
And this is just a start and in your project you can compute many other data quality metrics specific to your organization.

## Detecting anomalies

re_data looks at metrics gathered and alerts if those are suspicious comparing to data saw in the past. This means situations like those:
* sudden drops or increases in the volume of new records added to your tables
* longer than expected break between data arrivals
* increase in NULL values in one of your columns
* different maximal/minimal/avg numbers in any of table columns

Will be detected. All data including anomalies is saved directly into your data warehouse so you can easily integrate any existing alerting with it.

## UI

Ok.. so it's not really here yet, but we are working on it and will have some updates soon. Also remember your metrics are computed in your data warehouse so, you can visualize them in your favorite business inteligence tool.

We are focusing on making UI solve administrative part of data quality too, if you have your thoughts on what should be included let us know!

# Getting started
## Start your data quality project


```
pip install re_data
re_data init my_dq_project
```

re_data project is in fact a standard dbt project. But you don't need to use dbt for your workflows or even know dbt at all.
re_data has build in set of metrics computed which doesn't require you to write any code.

## Running your project

Running your project is very simple, just choose dates and run this (from your project folder):

```
re_data run --start-date 2021-01-18 --end-date 2021-01-19
```

This will create metrics and alerts for specfied date range and store it in your data warehouse (by default metrics are computed daily)

## Extending your project

If you would like to compute more metrics or otherwise extend your data quality project, you have 2 options:

* If you think, you needs maybe usefull for others let us know! We will be adding more features to re_data and will be happy to talk about your needs,
* If you think, what you need is specific to your organization, add it yourself. As re_data is dbt project you can add you own models / macros / tests etc. You need to know dbt for that, but we highly recommand learning writing code in it in this case - *it's Jinja templates generating SQL, nothing to be scared of :see_no_evil:*

# Docs

More details on tables created by re_data through dbt package are on project github https://github.com/re-data/dbt-re-data and docs for this package: [here](https://re-data.github.io/dbt-re-data/#!/overview/re_data)

# Community

Join [Slack](http://redata.team/slack) for questions about using re_data and discussion with people making it :slightly_smiling_face:


# Integrations

We support all main data warehouses supported by dbt. We plan to add support for Spark (now officially supported by dbt). Other DBs *may* work, after installing  dbt extension for them. We currently not test re_data against those, so you you can do it at your own risk.

<table>
	<thead>
		<tr>
			<th colspan="2">Integration</th>
			<th>Status</th>
		</tr>
	</thead>
	<tbody>
		<tr><td><img height="40" src="https://miro.medium.com/max/1024/0*eDEy4S8zFfYnRt1X.png" /></td><td style="width: 200px;"><a href="https://cloud.google.com/bigquery">BigQuery</a></td><td>Supported</td></tr>
		<tr><td><img height="40" src="https://www.pngkey.com/png/full/20-201458_when-ubers-engineering-team-published-a-blog-post.png" /></td><td style="width: 200px;"><a href="https://www.postgresql.org/">PostgreSQL</a></td><td>Supported</td></tr>
		<tr><td><img height="40" src="https://dbdb.io/media/logos/amazon-redshift.png" /></td><td style="width: 200px;"><a href="https://aws.amazon.com/redshift/">Redshift</a></td><td>Supported</td></tr>
		<tr><td><img height="40" src="https://www.snowflake.com/wp-content/themes/snowflake/img/snowflake-logo-blue@2x.png" /> </td><td style="width: 200px;"><a href="https://www.snowflake.com/">Snowflake</a></td><td>Supported</td></tr>
		<tr><td><img height="40" src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/f3/Apache_Spark_logo.svg/1200px-Apache_Spark_logo.svg.png" /> </td><td style="width: 200px;"><a href="https://spark.apache.org/">Apache Spark</a></td><td>Planned</td></tr>
	</tbody>
</table>


# License
re_data is licensed under the MIT license. See the [LICENSE](LICENSE) file for licensing information.

# Contributing

We love all contributions :heart_eyes: bigger and smaller.

Checkout out current list of issues [here](https://github.com/re-data/re-data/issues) and see if you like anything from there. Also feel welcome to join our [Slack](http://redata.team/slack) and suggest ideas or setup a live session [here](https://calendly.com/mateuszklimek/30min). 

And if you got this far and like what we are building, support us! Star https://github.com/re-data/re-data on Github :star_struck:

