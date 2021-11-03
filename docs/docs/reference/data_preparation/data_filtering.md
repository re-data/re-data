---
sidebar_position: 2
---

# Data Filtering

Data filtering refers to the process of choosing a smaller part of your dataset and using that subset for viewing or analysis.

Filtering may be used to:
- Look at results for a particular period of time.
- Exclude erroneous or "bad" observations from an analysis.

re_data provides the following macros for filtering data. Check out the list of currently available filters and let us know if you could use some different ones on **[Slack 😊](https://www.getre.io/slack)** or **[Github](https://github.com/re-data/re-data/issues/new?assignees=&labels=&template=macro_request.md&title=%5BMACRO%5D)**.

### [filter_remove_duplicates](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.filter_remove_duplicates)
*Arguments:*
- *relation: dbt model to perform the filtering on*
- *unique_cols: List of columns that uniquely identify each row*
- *sort_columns: Order in which we want to sort the partitioned rows. eg (created_at DESC, created_at ASC to choose the latest or earliest row based on the timestamp column*

Return type: table with filtered rows

This macro allows you remove duplicate rows from a dbt model based on certain conditions.

```sql
  id |  status      |   updated_at    |
--------------------------------------+
 1   |  pending     |    13:00:45     |
 2   |  completed   |    13:05:23     |
 1   |  completed   |    13:10:35     |
 2   |  pending     |    13:04:49     |
 3   |  completed   |    13:30:00     |

 => select id, status, updated_at from {{ re_data.filter_remove_duplicates(ref('duplicated'), ['id'], ['updated_at desc']) }} duplicates

 -- After filtering, the resulting rows are:

  id |  status      |   updated_at    |
--------------------------------------+
 1   |  completed   |    13:10:35     |
 2   |  completed   |    13:05:23     |
 3   |  completed   |    13:30:00     |
```


## Your ideas

If you have other suggestions of filtering data which you would like to be supported
**[let us know on Slack! 😊](https://www.getre.io/slack)**