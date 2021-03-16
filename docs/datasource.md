# DataSource

Data Source is object representing .. database :) Currently there are couple supported DBs (a listed on a main page).
Here we will try to cover what parameters you currently need to add for specific DBs.

### PostgreSQL

```
 - host
 - database
 - user
 - password
 - port (default is 5432 so don't need to add it if used)
 - schemas (here you specify which schemas to monitor, you can leave it empty for monitoring public schema)
```

### MySQL

```
 - host
 - database
 - user
 - password
 - port (default is 3306 so don't need to add it if used)
 - schemas (here you specify which schemas to monitor, you can leave it empty for monitoring public schema)
```

### BigQuery

```
 - host (this is essentially project_id in bigquery
 - schemas (here you pass bigquery datasets to monitor)
```

You don't need to pass more parameters, but if you are deploying locally you need to setup creds file for docker to use.
Currenlty it can be done via editing  `.env` file before starting Redata and uncommenting line `REDATA_BIGQUERY_KEY_FILE=PATH_TO_CREDS_FILE`
with adding path to your creds file.

### Redshift

```
 - host
 - database
 - user
 - password (user & password are credentials you get when creating redshift cluster)
 - port (please setup this even if you have default port 5439 used for redshift)
 - schemas (here you specify which schemas to monitor, you can leave it empty for monitoring public schema)
```
If for normal authentation to redshfit you are using your aws keys and would like to use it also here, let us know.
It's auth pattern we not support yet, but can add it if there is a need :)


### Snowflake
```
 - host
 - database
 - user
 - password
 - schemas
```
You don't need to specify port for snowflake.

## Notes

For all databases, Redata doesn't need write access to DBs, so it's recommended to pass read only credentials where possible.
It's possible to have multiple datasource per one DB,
(this is recommanded to for example one you want to monitor all tables in one schema and only some in other ones)

## What's next

After you add datasource, Redata will look into the tables in given schemas and add info about them to internal database.
Depending on it, if you checked `Run for all` it may start computing monitoring queries on them in next run or not.
If you want to choose tables, for which to run monitoring just set `Run for all` option to false and then update tables to monitor.
