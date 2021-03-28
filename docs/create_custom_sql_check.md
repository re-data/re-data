
# Custom sql metric

If you have your own custom checks, which you would like to visualize and look for anomalies there, it's easy to 
add those to Redata.

## Steps for the setup

Go to checks tab and click Create to start adding new check. You will see following fields:

- `name` - choose some name for you check, it doesn't need to be unique.

- `metrics` - this is information on what metrics you would like to collect, those need to be unique per table.
  Here is example table metric you can create:
  ```
  {
    "__table__metric__": [
      "count_all_from_uk"
    ]
  } 
  ```
  
  Note that, you can definte multiple metrics per single check (you than need to collect them all through single SQL select statement)
  In SQL queries, you most likely would be mainly creating metrics on table leve (`"__table__metric__"` part in JSON).
  
  It's possible to create metrics for specific column in the table (by passing column_name to JSON), but it mostly usefull if check is python function call
  (currenlty only internal checks are python ones). For SQL queries only benefit of making given metric specificly column metric is showing them in different place
  in generated dashboards (together with other python metrics)
  
- `query` - once metrics are defined it's time to create query which collects those metrics. Query is simply SQL select statement which selects metrics specified
  in previous fields. To make queries more generic it's possible to use `{{table_name}}` in them to autmatically transform to table specfied for check. Apart from that
  if possible and desired it's possible to add time based filtering in custom queries. You can use `{{period_start}}` and `{{period_end}}` to specify time range (by default 
  it's 24 hours time range) to filter by. Using those variables would make it possible to backfill data from the past. Sample query will look like this:
  ```
  {
    "sql": "select count(*) as count_all_from_uk from {{table_name}} where created_at > {{period_start}} and created_at < {{period_end}} and country = 'UK' ",
    "type": "sql"
  }
  ```
  
- `table` - choose table for which you are computing metric. If you are joining couple tables to get the metric (you can definitely do that) just pick one for which
  you would metric to be showed in generated dashboards.
 
 That is all, you can now click create and metrics will be computed in the next scans. Currenlty there is no way to run just the custom metric or test it more easily.
 We are planning to add this in the future.


