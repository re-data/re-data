<p align="center">
<img alt="Logo" width=18% src="static/logo/redata_logo_cicle.svg"/>
</p>
<p align="center">
<a href="http://re-data.io/slack"><img alt="Slack" src="https://img.shields.io/badge/chat-slack-blue.svg"/></a>
<img alt="License" src="https://img.shields.io/github/license/redata-team/redata?color=violet"/>
<img alt="Last commit" src="https://img.shields.io/github/last-commit/redata-team/redata"/>
</p>

# re_data

re_data is a framework to improve data quality in your company, build on top of [dbt](https://github.com/fishtown-analytics/dbt).

* create a data quality project for your organization to monitor and improve the quality of your data,
* compute data quality metrics for all your tables and add your own code computing those,
* look for anomalies in all your metrics and investigate problematic data

# Key features

## Data quality metrics
re_data creates data quality metrics schema in your data warehouse containing metrics for all your tables (or only those you would like to monitor)
Metrics schema contains information about:

* time since last records were added
* number of records added
* number of missing values in columns over time
* min/max/avg of values in all your columns
* string lengths in all your columns

Think about it as an `INFORMATION_SCHEMA` on steroids :muscle:
And this is just a start and in your project, you can compute many other data quality metrics specific to your organization.

## Detecting anomalies

re_data looks at metrics gathered and alerts if those are suspicious, comparing to data saw in the past. This means situations like those:
* sudden drops or increases in the volume of new records added to your tables
* longer than expected break between data arrivals
* increase in NULL values in one of your columns
* different maximal/minimal/avg numbers in any of table columns

Will be detected. All data including anomalies is saved directly into your data warehouse so you can easily integrate any existing alerting with it.

## Data testing

re_data supports writing data tests by adding `dbt_expectations` library (and some of our test macros) to dbt project created. We recommend using it, to test both:
 * tables you are monitoring
 * metrics about your data created by re_data

# Getting started

Follow our getting started toy shop tutorial! [here 🎈🚙 🦄](getting_started/toy_shop_analysis/README.md)

# Docs

More details on tables created by re_data through dbt package are on the project Github https://github.com/re-data/dbt-re-data and docs for this package: [here](https://re-data.github.io/dbt-re-data/#!/overview/re_data)

# Community

Join [Slack](http://re-data.io/slack) for questions about using re_data and discussion with people making it :slightly_smiling_face:


# Integrations

We support almost all of the main data warehouses supported by dbt. We plan to add support for Spark (now officially supported by dbt).

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

Check out the current list of issues [here](https://github.com/re-data/re-data/issues) and see if you like anything from there. Also, feel welcome to join our [Slack](http://re-data.io/slack) and suggest ideas or set up a live session [here](https://calendly.com/mateuszklimek/30min). 

And if you got this far and like what we are building, support us! Star https://github.com/re-data/re-data on Github :star_struck:


