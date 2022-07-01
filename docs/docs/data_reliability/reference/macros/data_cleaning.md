---
sidebar_position: 1
---

# Data Cleaning

Data cleaning refers to fixing incorrect, corrupted, incorrectly formatted data within a dataset. They sometime come up and there could be a need to further clean up the data before it could be used by downstream systems.

re_data provides the fol macros to help reduce the time required to clean up a dataset. Check out the list of data cleaning macros available and let us know if you could use some different ones on **[Slack 😊](https://www.getre.io/slack)** or **[Github](https://github.com/re-data/re-data/issues/new?assignees=&labels=&template=macro_request.md&title=%5BMACRO%5D)**.

### clean_additional_whitespaces
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.clean_additional_whitespaces)
*Arguments:*
- *column: The column name or column expression to perform the cleaning operation on.*

Returns: text with removed whitespaces

This macro helps clean additional whitespaces between words ensuring that the maximum whitespace character between two words is one. Trailing and leading whitespaces are also removed using the `trim` function.

The example below shows how the macro can be used to fix incorrectly formatted names in a sample user table.

```sql
=> select
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
### clean_blacklist
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.clean_blacklist)
*Arguments:*
- *column: The column name or column expression to perform the cleaning operation on.*
- *chars_to_blacklist: List of words or regex patterns to match in the column.*
- *replacement: a string that will replace each occurrence of the word or regex pattern.*

Returns: text with blacklisted characters replaced with *replacement*

```sql
=> select 
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
### clean_capitalize_words
#### [(source code)](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.clean_capitalize_words)
*Arguments:*
- *column: The column name or column expression to perform the cleaning operation on.*

    This macro helps capitalize the first letter of each word in a string.

Returns: text with capitalized words

Below shows a sample table that contains badly formatted full names. We would like to clean up the extra whitespaces and capitalize the names. Also we want to redact the username part of the email addresses.

```sql
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

If you have any suggesstions please feel free to raise an issue [here](https://github.com/re-data/re-data/issues).

## Your ideas

If you have other suggestions of cleaning data which you would like to be supported
**[let us know on Slack! 😊](https://www.getre.io/slack)**
