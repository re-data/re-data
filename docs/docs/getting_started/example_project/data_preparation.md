---
sidebar_position: 4
---

# Data Preparation 

re_data provides useful macros for performing data preparation tasks like [cleaning](/docs/reference/data_preparation/data_cleaning), [normalizing](/docs/reference/data_preparation/data_normalization), [filtering](/docs/reference/data_preparation/data_filtering) and [validating](/docs/reference/data_preparation/data_validation). In the example shown below, common data preparation tasks are shown.

```sql title="user_data preview"
=> select * from toy_shop.user_data;

        full_name        |             email              |   state   |     created_at      
-------------------------+--------------------------------+-----------+---------------------
 lizzie effertz          | torp.trisha@fakemail.com       | Arizona   | 2020-01-31 11:51:00
 orlando abbott          | dayton.hermiston@fakemail.com  | IN        | 2020-01-31 11:50:00
 kelley     harann       | borer.blake@fakemail.com       | WV        | 2020-01-31 11:49:00
 ruth   langworth        | garett66@fakemail.com          | MN        | 2020-01-31 11:48:00
 lane swift              | nienow.coralie@fakemail.com    | IN        | 2020-01-31 11:47:00
 bertha corwin           | tstroman@fakemail.com          | WV        | 2020-01-31 11:46:00
 manuela   kling         | shawn.langworth@fakemail.com   | MN        | 2020-01-31 11:45:00
 mose balistreri         | dorris70@fakemail.com          | NY        | 2020-01-31 11:44:00
 robin    halvorson      | murazik.americo@fakemail.com   | IN        | 2020-01-31 11:43:00
 osbaldo parker i        | friesen.angeline@fakemail.com  | WV        | 2020-01-31 11:42:00
 javier runolfsson       | benjamin.bailey@fakemail.net   | Minnesota | 2020-01-31 11:41:00
 amelia batz             | garrison60@fakemail.com        | IN        | 2020-01-31 11:40:00
 abby  pouros            | dominique.leannon@fakemail.com | WV        | 2020-01-31 11:39:00
 markus homenick         | piper73@fakemail.com           | New York  | 2020-01-31 11:38:00
 braeden turner          | kozey.jace@fakemail.com        | IN        | 2020-01-31 11:37:00
 horacio   parker        | vtillman@fakemail.info         | WV        | 2020-01-31 11:36:00
 ms. stacy       padberg | erdman.elaina@fakemail.com     | MN        | 2020-01-31 11:35:00
 dr.     deshawn stracke | rosendo.beer@fakemail.com      | IN        | 2020-01-31 11:34:00
 pascale grady           | princess60@fakemail.com        | WV        | 2020-01-31 11:33:00
 lacy     brekke         | romaguera.darrell@fakemail.com | AZ        | 2020-01-31 11:32:00
```

First we start by filtering out the duplicated based on the `email` column.
You will notice the `full_name` column above has additional whitespaces between words, we can strip those additional whitespaces and capitalize the words.

For further analysis, we would like to have the full state name as a separate column, re_data allows you to pass dictionary mapping of source and target values.
```sql title="toy_shop/models/sanitized_user_data.sql"
{% set states_mapping = {'AZ': 'Arizona', 'IN': 'Indiana', 'WV': 'West Virginia', 'MN': 'Minnesota', 'NY': 'New York'}%}

with deduplicated as (
    select * from {{ re_data.filter_remove_duplicates(ref('user_data'), ['email'], ['created_at DESC']) }} as dedup
), 
cleaned as (
    select
        *,
        {{ re_data.clean_capitalize_words(re_data.clean_additional_whitespaces('full_name')) }} as formatted_full_name,
        {{ re_data.clean_blacklist('email', ['^[a-zA-Z0-9_.+-]+'], '*****') }} as redacted_email,
        {{ re_data.valid_email('email') }} is_valid_email
    from deduplicated 
)

select
    *
from {{ re_data.normalize_values('cleaned', 'state', states_mapping) }} u
```

Let's run the `sanitized_user_data` model and view the results.
```bash
dbt run --models sanitized_user_data
```

```sql
=> select * from toy_shop.sanitized_user_data;

        full_name        |             email              |   state   |     created_at      | formatted_full_name |   redacted_email    | is_valid_email | state__normalized 
-------------------------+--------------------------------+-----------+---------------------+---------------------+---------------------+----------------+-------------------
 lacy     brekke         | romaguera.darrell@fakemail.com | AZ        | 2020-01-31 11:32:00 | Lacy Brekke         | *****@fakemail.com  | t              | Arizona
 dr.     deshawn stracke | rosendo.beer@fakemail.com      | IN        | 2020-01-31 11:34:00 | Dr. Deshawn Stracke | *****@fakemail.com  | t              | Indiana
 lane swift              | nienow.coralie@fakemail.com    | IN        | 2020-01-31 11:47:00 | Lane Swift          | *****@fakemail.com  | t              | Indiana
 robin    halvorson      | murazik.americo@fakemail.com   | IN        | 2020-01-31 11:43:00 | Robin Halvorson     | *****@fakemail.com  | t              | Indiana
 braeden turner          | kozey.jace@fakemail.com        | IN        | 2020-01-31 11:37:00 | Braeden Turner      | *****@fakemail.com  | t              | Indiana
 amelia batz             | garrison60@fakemail.com        | IN        | 2020-01-31 11:40:00 | Amelia Batz         | *****@fakemail.com  | t              | Indiana
 orlando abbott          | dayton.hermiston@fakemail.com  | IN        | 2020-01-31 11:50:00 | Orlando Abbott      | *****@fakemail.com  | t              | Indiana
 horacio   parker        | vtillman@fakemail.info         | WV        | 2020-01-31 11:36:00 | Horacio Parker      | *****@fakemail.info | t              | West Virginia
 bertha corwin           | tstroman@fakemail.com          | WV        | 2020-01-31 11:46:00 | Bertha Corwin       | *****@fakemail.com  | t              | West Virginia
 pascale grady           | princess60@fakemail.com        | WV        | 2020-01-31 11:33:00 | Pascale Grady       | *****@fakemail.com  | t              | West Virginia
 osbaldo parker i        | friesen.angeline@fakemail.com  | WV        | 2020-01-31 11:42:00 | Osbaldo Parker I    | *****@fakemail.com  | t              | West Virginia
 abby  pouros            | dominique.leannon@fakemail.com | WV        | 2020-01-31 11:39:00 | Abby Pouros         | *****@fakemail.com  | t              | West Virginia
 kelley     harann       | borer.blake@fakemail.com       | WV        | 2020-01-31 11:49:00 | Kelley Harann       | *****@fakemail.com  | t              | West Virginia
 manuela   kling         | shawn.langworth@fakemail.com   | MN        | 2020-01-31 11:45:00 | Manuela Kling       | *****@fakemail.com  | t              | Minnesota
 ruth   langworth        | garett66@fakemail.com          | MN        | 2020-01-31 11:48:00 | Ruth Langworth      | *****@fakemail.com  | t              | Minnesota
 ms. stacy       padberg | erdman.elaina@fakemail.com     | MN        | 2020-01-31 11:35:00 | Ms. Stacy Padberg   | *****@fakemail.com  | t              | Minnesota
 mose balistreri         | dorris70@fakemail.com          | NY        | 2020-01-31 11:44:00 | Mose Balistreri     | *****@fakemail.com  | t              | New York
 javier runolfsson       | benjamin.bailey@fakemail.net   | Minnesota | 2020-01-31 11:41:00 | Javier Runolfsson   | *****@fakemail.net  | t              | Minnesota
 markus homenick         | piper73@fakemail.com           | New York  | 2020-01-31 11:38:00 | Markus Homenick     | *****@fakemail.com  | t              | New York
 lizzie effertz          | torp.trisha@fakemail.com       | Arizona   | 2020-01-31 11:51:00 | Lizzie Effertz      | *****@fakemail.com  | t              | Arizona
```