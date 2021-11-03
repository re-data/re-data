---
sidebar_position: 1
---

# Data Cleaning

Data cleaning refers to fixing incorrect, corrupted, incorrectly formatted data within a dataset. They sometime come up and there could be a need to further clean up the data before it could be used by downstream systems.

re_data provides the fol macros to help reduce the time required to clean up a dataset. Check out the list of data cleaning macros available and let us know if you could use some different ones on **[Slack 😊](https://www.getre.io/slack)** or **[Github](https://github.com/re-data/re-data/issues/new?assignees=&labels=&template=feature_request.md&title=%5BFEATURE%5D)**.
## [clean_additional_whitespace](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.clean_additional_whitespaces)
*Arguments:*
- *column: The column name or column expression to perform the cleaning operation on.*

This macro helps clean additional whitespaces between words ensuring that the maximum whitespace character between two words is one. Trailing and leading whitespaces are also removed using the `trim` function.

The example below shows how the macro can be used to fix incorrectly formatted names in a sample user table.

```sql title="Cleaning additional whitespace"
select
    full_name,
    {{ re_data.clean_additional_whitespaces('full_name') }} as corrected_full_name
from {{ ref('sample_user_data') }}

  full_name             |   corrected_full_name  |   
-------------------------------------------------+
  lizzie effertz        |  lizzie effertz        |
  orlando abbott        |  orlando abbott        |
 kelley     harann      |  kelley harann         |
 ruth   langworth       |  ruth langworth        |
 lane swift             |  lane swift            |
```
## [clean_blacklist](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.clean_blacklist)
*Arguments:*
- *column: The column name or column expression to perform the cleaning operation on.*
- *chars_to_blacklist: List of words or regex patterns to match in the column.*
- *replacement: a string that will replace each occurrence of the word or regex pattern.*

```sql title="Blacklisting username part of email address"
select 
    email,
    {{ re_data.clean_blacklist("email", ["^[a-zA-Z0-9_.+-]+"], "*****") }} as redacted_email 
from {{ ref("sample_user_data") }}

  email                          |   redacted_email        |   
-----------------------------------------------------------+
 torp.trisha@fakemail.com        |  *****@fakemail.com     |
 dayton.hermiston@fakemail.com   |  *****@fakemail.com     |
 borer.blake@fakemail.com        |  *****@fakemail.com     |
 garett66@fakemail.com           |  *****@fakemail.com     |
 nienow.coralie@fakemail.com     |  *****@fakemail.com     |
```

This macro helps find certain words or regex pattern in a given column and replace it with the given replacement value.
## [clean_capitalize_words](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.clean_capitalize_words)
*Arguments:*
- *column: The column name or column expression to perform the cleaning operation on.*

    This macro helps capitalize the first letter of each word in a string.

Below shows a sample table that contains badly formatted full names. We would like to clean up the extra whitespaces and capitalize the names. Also we want to redact the username part of the email addresses.

```sql title="Capitalizing words"
=> select
        full_name,
        {{ re_data.clean_capitalize_words('full_name') }} as capitalized_full_name
    from {{ ref('sample_user_data') }}

   full_name            |  capitalized_full_name    |
----------------------------------------------------+
  lizzie effertz        |   Lizzie Effertz          |
  orlando abbott        |   Orlando Abbott          |
  kelley harann         |   Kelly Harann            |
  ruth langworth        |   Ruth Langworth          |
  lane swift            |   Lane Swift              |
```

```csv title="Incorrectly formatted data | table=sample_user_data"
full_name,email
  lizzie effertz,torp.trisha@fakemail.com
 orlando abbott,dayton.hermiston@fakemail.com
kelley     harann,borer.blake@fakemail.com
ruth   langworth,garett66@fakemail.com
lane swift  ,nienow.coralie@fakemail.com
bertha corwin ,tstroman@fakemail.com
manuela   kling,shawn.langworth@fakemail.com
mose balistreri,dorris70@fakemail.com
robin    halvorson,murazik.americo@fakemail.com
     osbaldo parker i  ,friesen.angeline@fakemail.com
javier runolfsson  ,benjamin.bailey@fakemail.net
amelia batz,garrison60@fakemail.com
abby  pouros,dominique.leannon@fakemail.com
markus homenick,piper73@fakemail.com
braeden turner,kozey.jace@fakemail.com
horacio   parker,vtillman@fakemail.info
ms. stacy       padberg,erdman.elaina@fakemail.com
dr.     deshawn stracke,rosendo.beer@fakemail.com
  pascale grady,princess60@fakemail.com
lacy     brekke,romaguera.darrell@fakemail.com
```

We can have a model that utilizes the data cleaning macros provided by re_data to clean up the table data
```sql title="models/sanitized_user_data.sql"
select
    {{ re_data.clean_capitalize_words(re_data.clean_additional_whitespaces('full_name')) }} as full_name,
    {{ re_data.clean_blacklist('email', ['^[a-zA-Z0-9_.+-]+'], '*****') }} as email
from {{ ref('sample_user_data') }}
```

The model above will produce the following rows.
```csv title="Cleaned dataset | table=sanitized_user_data"
full_name,email
Lizzie Effertz,*****@fakemail.com
Orlando Abbott,*****@fakemail.com
Kelley Harann,*****@fakemail.com
Ruth Langworth,*****@fakemail.com
Lane Swift,*****@fakemail.com
Bertha Corwin,*****@fakemail.com
Manuela Kling,*****@fakemail.com
Mose Balistreri,*****@fakemail.com
Robin Halvorson,*****@fakemail.com
Osbaldo Parker I,*****@fakemail.com
Javier Runolfsson,*****@fakemail.net
Amelia Batz,*****@fakemail.com
Abby Pouros,*****@fakemail.com
Markus Homenick,*****@fakemail.com
Braeden Turner,*****@fakemail.com
Horacio Parker,*****@fakemail.info
Ms. Stacy Padberg,*****@fakemail.com
Dr. Deshawn Stracke,*****@fakemail.com
Pascale Grady,*****@fakemail.com
Lacy Brekke,*****@fakemail.com
```

If you have any suggesstions please feel free to raise an issue [here](https://github.com/re-data/re-data/issues).