---
sidebar_position: 3
---

# Data Preparation 

re_data provides useful macros for performing data preparation tasks like [cleaning](/docs/reference/data_preparation/data_cleaning), [normalizing](/docs/reference/data_preparation/data_normalization), [filtering](/docs/reference/data_preparation/data_filtering) and [validating](/docs/reference/data_preparation/data_validation). In the example shown below, common data preparation tasks are shown.

```sql title="user_data preview"
=> select * from toy_shop.user_data;

                  id                  |        full_name        |             email              | state |     created_at      
--------------------------------------+-------------------------+--------------------------------+-------+---------------------
 9994d5be-3d76-11ec-9bbc-0242ac130002 | lizzie effertz          | torp.trisha@fakemail.com       | AZ    | 2020-01-31 11:51:00
 9994d7ee-3d76-11ec-9bbc-0242ac130002 | orlando abbott          | dayton.hermiston@fakemail.com  | IN    | 2020-01-31 11:50:00
 9994d7ee-3d76-11ec-9bbc-0242ac130002 | orlando abbott          | dayton.hermiston@fakemail.com  | IN    | 2020-01-31 11:50:00
 9994dae6-3d76-11ec-9bbc-0242ac130002 | kelley     harann       | borer.blake@fakemail.com       | WV    | 2020-01-31 11:49:00
 9994dbc2-3d76-11ec-9bbc-0242ac130002 | ruth   langworth        | garett66@fakemail.com          | MN    | 2020-01-31 11:48:00
 9994dbc2-3d76-11ec-9bbc-0242ac130002 | ruth   langworth        | garett66@fakemail.com          | MN    | 2020-01-31 11:48:00
 9994dc8a-3d76-11ec-9bbc-0242ac130002 | lane swift              | nienow.coralie@fakemail.com    | IN    | 2020-01-31 11:47:00
 9994dd48-3d76-11ec-9bbc-0242ac130002 | bertha corwin           | tstroman@fakemail.com          | WV    | 2020-01-31 11:46:00
 99943d76-11ec-9bbc-0242ac130002      | manuela   kling         | shawn.langworth@fakemail.com   | MN    | 2020-01-31 11:45:00
```

You will notice the `full_name` column above has additional whitespaces between words and the row with mauela has an invalid uuid. We can strip those additional whitespaces, capitalize the words and filter out invalid uuid.

For further analysis, we would like to have the full state name as a separate column, re_data allows you to pass dictionary mapping of source and target values or a dbt model/cte (source and target column names must exist).
```sql title="models/sanitized_user_data.sql"
{% set states_mapping = {'AZ': 'Arizona', 'IN': 'Indiana', 'WV': 'West Virginia', 'MN': 'Minnesota', 'NY': 'New York'}%}
select
    id,
    {{ re_data.clean_capitalize_words(re_data.clean_additional_whitespaces('full_name')) }} as full_name,
    email,
    {{ re_data.clean_blacklist('email', ['^[a-zA-Z0-9_.+-]+'], '*****') }} as redacted_email,
    state,
    state__normalized,
    {{ re_data.valid_email('email') }} is_valid_email,
    created_at
from {{ re_data.normalize_values(
    ref('user_data'), 'state', states_mapping) }} u
where {{ re_data.valid_uuid('id') }}

=> select * from toy_shop.sanitized_user_data;

                  id                  |      full_name      |             email              |   redacted_email    | state | state__normalized | is_valid_email |     created_at      
--------------------------------------+---------------------+--------------------------------+---------------------+-------+-------------------+----------------+---------------------
 9994d5be-3d76-11ec-9bbc-0242ac130002 | Lizzie Effertz      | torp.trisha@fakemail.com       | *****@fakemail.com  | AZ    | Arizona           | t              | 2020-01-31 11:51:00
 9994d7ee-3d76-11ec-9bbc-0242ac130002 | Orlando Abbott      | dayton.hermiston@fakemail.com  | *****@fakemail.com  | IN    | Indiana           | t              | 2020-01-31 11:50:00
 9994d7ee-3d76-11ec-9bbc-0242ac130002 | Orlando Abbott      | dayton.hermiston@fakemail.com  | *****@fakemail.com  | IN    | Indiana           | t              | 2020-01-31 11:50:00
 9994dae6-3d76-11ec-9bbc-0242ac130002 | Kelley Harann       | borer.blake@fakemail.com       | *****@fakemail.com  | WV    | West Virginia     | t              | 2020-01-31 11:49:00
 9994dbc2-3d76-11ec-9bbc-0242ac130002 | Ruth Langworth      | garett66@fakemail.com          | *****@fakemail.com  | MN    | Minnesota         | t              | 2020-01-31 11:48:00
 9994dbc2-3d76-11ec-9bbc-0242ac130002 | Ruth Langworth      | garett66@fakemail.com          | *****@fakemail.com  | MN    | Minnesota         | t              | 2020-01-31 11:48:00
 9994dc8a-3d76-11ec-9bbc-0242ac130002 | Lane Swift          | nienow.coralie@fakemail.com    | *****@fakemail.com  | IN    | Indiana           | t              | 2020-01-31 11:47:00
 9994dd48-3d76-11ec-9bbc-0242ac130002 | Bertha Corwin       | tstroman@fakemail.com          | *****@fakemail.com  | WV    | West Virginia     | t              | 2020-01-31 11:46:00
```

Duplicates are very common occurrences, [filter_remove_duplicates](http://localhost:3000/re-data/docs/reference/data_preparation/data_filtering#filter_remove_duplicates) macro helps to filter them out based on the specified condition.

```sql
select
    id,
    {{ re_data.clean_capitalize_words(re_data.clean_additional_whitespaces('full_name')) }} as full_name,
    email,
    {{ re_data.clean_blacklist('email', ['^[a-zA-Z0-9_.+-]+'], '*****') }} as redacted_email,
    state,
    state__normalized,
    {{ re_data.valid_email('email') }} is_valid_email,
    created_at
from {{ 
    re_data.normalize_values(
        re_data.filter_remove_duplicates(ref('user_data'), ['id'], ['created_at DESC']),
         'state',
         states_mapping
        ) }} u
where {{ re_data.valid_uuid('id') }}

                  id                  |      full_name      |             email              |   redacted_email    | state | state__normalized | is_valid_email |     created_at      
--------------------------------------+---------------------+--------------------------------+---------------------+-------+-------------------+----------------+---------------------
 9994d5be-3d76-11ec-9bbc-0242ac130002 | Lizzie Effertz      | torp.trisha@fakemail.com       | *****@fakemail.com  | AZ    | Arizona           | t              | 2020-01-31 11:51:00
 9994d7ee-3d76-11ec-9bbc-0242ac130002 | Orlando Abbott      | dayton.hermiston@fakemail.com  | *****@fakemail.com  | IN    | Indiana           | t              | 2020-01-31 11:50:00
 9994dae6-3d76-11ec-9bbc-0242ac130002 | Kelley Harann       | borer.blake@fakemail.com       | *****@fakemail.com  | WV    | West Virginia     | t              | 2020-01-31 11:49:00
 9994dbc2-3d76-11ec-9bbc-0242ac130002 | Ruth Langworth      | garett66@fakemail.com          | *****@fakemail.com  | MN    | Minnesota         | t              | 2020-01-31 11:48:00
 9994dc8a-3d76-11ec-9bbc-0242ac130002 | Lane Swift          | nienow.coralie@fakemail.com    | *****@fakemail.com  | IN    | Indiana           | t              | 2020-01-31 11:47:00
 9994dd48-3d76-11ec-9bbc-0242ac130002 | Bertha Corwin       | tstroman@fakemail.com          | *****@fakemail.com  | WV    | West Virginia     | t              | 2020-01-31 11:46:00
```