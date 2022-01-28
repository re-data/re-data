---
sidebar_position: 3
---

# Data Normalization

Data normalization refers to a process wherein data within a dataset is reorganized in such a way so that users can properly utilize that dataset for further queries and analysis. 

re_data provides the following macros for normalization. Check out the list of data normalization macros and let us know if you could use some different ones on **[Slack 😊](https://www.getre.io/slack)** or **[Github](https://github.com/re-data/re-data/issues/new?assignees=&labels=&template=macro_request.md&title=%5BMACRO%5D)**.

###  [normalize_values](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.normalize_values)
*Arguments:*
- *source_relation: The model that contains the column in which the normalization would be performed on.*
- *column: The column name or column expression to be normalized.*
- *reference_table: A pair of source and target values used for normalization. This could either be a dbt model, a common table expression or a dictionary. Note that for dbt models and cte, the `source` and `target` column must exist for the macro to work properly.*

Returns: Table with `normalized` column added

This macro adds a new column to the source relation using the format column_name + '__normalized'. This column contains the transformation from source to target.

Let's say we have a table that contains US states in the abbreviated format and the corresponding state code. We might want to have the full names of each state for better presentation by reporting tools.

```sql
{% set us_states_mapping = {'Ala.': 'Alabama', 'Alaska': 'Alaska', 'Ariz.': 'Arizona',
    'Ark.': 'Arkansas', 'Calif.': 'California', 'Colo.': 'Colorado'} 
%}

=> select state, code, state__normalized from {{ re_data.normalize_values(ref('abbreviated_us_states'), 'state', us_states_mapping)

  state   |  code   |   state__normalized    |
--------------------------------------------+
 Alabama  |  AL     |    Alabama             |
 Ariz.    |  AZ     |    Arizona             |
 Arkansas |  AR     |    Arkansas            |
 Calif.   |  CA     |    California          |
 Colo.    |  CO     |    Colorado            |

```

## Your ideas

If you have other suggestions of normalizing data which you would like to be supported
**[let us know on Slack! 😊](https://www.getre.io/slack)**
