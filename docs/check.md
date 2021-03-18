# Check

Check is probably most unclear object in Redata... :) but not that much.
It represents single operation done to get metrics about your table.
This operation can create multiple metrics, for multiple columns of your table.

Currently check is always single SQL query run on DB (but this will stop being true in some time for sure :)
Checks has couple interesting parameters

###	Metrics

Before explaining it, let's look at some examples of this records

```
{
  "__table__metric__": ["count_rows"]
}
```

```
{
  "col1": ["max_length", "min_length", "avg_length", "count_nulls", "count_empty"],
  "col2": ["max", "min", "avg", "sum", "count_nulls"],
  "col4": ["max", "min", "avg", "sum", "count_nulls"],
  "testing": ["max_length", "min_length", "avg_length", "count_nulls", "count_empty"]
}
```

We can see, that for each column we specifcy what we want to be run. Also it's possible to specifcy to run something for the whole table using
`__table__metric__` keyword. Redata knows how to run those specific checks: `max`, `min` etc. on DBs.
If you wan to you can modify metrics to be computed and for example delete `sum` if it doesn't make sense to you. (We will also stop showing `sum` panel in Grafana then). Modifying/Removing metrics will not delete past information about them.

### Query
A query is something which actually runs an operation on DB. Looking at example.

```
{
  "path": "redata.checks.data_values.check_column_values",
  "type": "standard",
  "params": {
    "time_interval": "1 day"
  }
}
```

We can see query referances, python function which is called. It's internal redata function currently.
This function receives metrics it should compute (from metrics field)
It's expected that different functions support different metrics so editing this is not encouraged unless you know how Redata works internally :)

For the future plan is to make it possible to pass path to you own functions.
Also other not added here yet option is creating query and passing raw SQL to be called on DB (this should be added soon)

