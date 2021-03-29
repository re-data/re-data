
# Contributing DB connector

Good first things to contribute are integerations for you DB (if this is not supported yet)
Currently Redata supports some major DBs, but still there are many to go :)
Lot of new DBs to support already have [issues created](https://github.com/redata-team/redata/issues?q=is%3Aissue+is%3Aopen+label%3A%22new+integration%22)
But don't worry if you DB is not here.

For many SQL based DBs adding SQL-alchemy integration shouldn't be that complicated.
`redata.backends.sql_alchemy.SqlAlchemy` is a class in Redata you would be extending in this case.

Sublasses for specific DBs `Postgres`, `Redshift`, `BigQuery`, `MySQL`, `Snowflake` define:
 - `numeric_types`
 - `character_types`
 - `datetime_types`

Plus some of them, need to adjust logic used in main SQL-alchemy class.

Once class for DB is defined, you would need to modify `redata.models.data_source.DataSource` class to support this type.

It means 2 things:
  - adding DB to `SUPPORTED_SOURCES` list
  - modifying `get_db_object` function to produce object corresponding to given DB

Once that is DONE you can test you connector, to be able to modify code easily when testing
you will need to start redata in dev mode you can change [contribting guide](CONTRIBUTING.md) for that :)
