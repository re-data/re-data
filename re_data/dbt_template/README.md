Welcome to your data quality project

### Setup for you data quality project

One thing you need to do, is to add YOUR_PROJECT_NAME into yours `/.dbt/profiles.yml` file

For details on how to setup connectors check dbt reference:
 - [BigQuery](https://docs.getdbt.com/reference/warehouse-profiles/bigquery-profile)
 - [PostreSQL](https://docs.getdbt.com/reference/warehouse-profiles/postgres-profile)
 - [Redshift](https://docs.getdbt.com/reference/warehouse-profiles/redshift-profile)
 - [Snowflake](https://docs.getdbt.com/reference/warehouse-profiles/snowflake-profile)

*If you are using dbt cloud, just open this project in it and add DBs in the UI*

You also need to specify which schemas you would like to monitor for data quality, just specify it in your `dbt_project.yml` file. 

```
vars:
     redata:schemas:
         - schema_to_monitor
         - another_schema_to_monitor
```

Once you done that, you are all set and ready and it should be possible to run project for you.

### Running your data quality project

You can run this project without writing any additional code, you can do it by running:

```
re_data run --start-date 2021-01-18 --end-date 2021-01-19
```



