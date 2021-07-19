<p align="center">
<img alt="Logo" width=18% src="static/logo/redata_logo_cicle.svg"/>
</p>
<p align="center">
<a href="http://re-data.io/slack"><img alt="Slack" src="https://img.shields.io/badge/chat-slack-blue.svg"/></a>
<img alt="License" src="https://img.shields.io/github/license/redata-team/redata?color=violet"/>
<img alt="Last commit" src="https://img.shields.io/github/last-commit/redata-team/redata"/>
</p>

# re_data

re_data is data quality framework. It lets you do queries similar to those:

```sql title="Your Data Warehouse"
select * from anomalies_in_row_counts;

select * from recent_schema_changes;

select * from all_tables_freshness order by last_update_time;

select * from daily_null_percent where table = 'X' and col = 'Y';
```

in your Snowflake, Redshift, BigQuery, Postgres DB.

Build as dbt-package & optional python lib. 

It let's you know what's happening in your data.

And you can visualize it, any way you want in your favorite BI tool.

# Getting stated

Check out [docs :notebook_with_decorative_cover:  :notebook_with_decorative_cover:](https://re-data.github.io/re-data/docs/introduction/whatis)

# Source code

As dbt packages, currenlty need to be a seperate github repos - most of source code of re_data is [here](https://github.com/re-data/dbt-re-data)

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


