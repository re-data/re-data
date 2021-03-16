# Table

Table is object representing ... tables in your DB.
There are couple things related to tables in Redata.
Let get over some things which show up on tables view.

### Active

Tables can be active or not, active means actively monitored.
At any point you can change the state of the table from active to not (and backwards)
It will not remove any data previously gathered on table, but if will of course stop gaterhing new data

### Time Column

Time column is column which Redata uses for information about creation time of record.
Redata uses 'smart ifs' to guess this column from data, but it will not be always right.
If you see that it guessed incorectly you can modify it (just edit in the list view)

It may happen that your table doesn't have any columns representing creation time of record.
If only possible we would recommand adding this (it really makes debugging lot of things easier) to your DB.

If that's not possible, currently Redata doesn't suport those tables (those will in fact be skipped and you will not see them in tables view)
We plan to add this feature, if you need it feel free to reach to us about it :)

### Grafana Url

As name suggest it's an URL to Grafana, containing all panels generated for given table. Will talk more about specific panels in other sections.

### Eye/Details icon

Eeach table in list view have little eye icon, this will take you to table details. We summarize some stats about table there:

```
 - schema
 - schema changes
 - last insert to table
 - alerts related to the table
```

### Edit

You can edit tables, main reason for edit will be changing active state and time column


