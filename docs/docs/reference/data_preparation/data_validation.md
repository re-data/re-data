---
sidebar_position: 4
---


# Data Validation

Data validation refers to checking if data within your dataset, meet certain criteria. Validation often needs to be done on data that comes as text but represents something specific like number identifier, email, date, ip_address.

Check out the list of currently available validations and let us know if you could use some different ones on **[Slack 😊](https://www.getre.io/slack)** or **[Github](https://github.com/re-data/re-data/issues/new?assignees=&labels=&template=feature_request.md&title=%5BFEATURE%5D)**.

## Date & Time

### [re_data.valid_date_eu](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_date_eu)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data meets european date format. (-./) allowed as separators.

```sql
=> select date_time, {{ re_data.valid_date_eu('date_time')}} as valid_date_eu

  date_time  | valid_date_eu
------------+---------------
 31-01-2020 |             1
 01/31/2020 |             0
 05.05.2020 |             1

```

### [re_data.valid_date_us](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_date_us)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data meets us date format.

```sql
=> select date_time, {{ re_data.valid_date_us('date_time')}} as valid_date_us

  date_time  | valid_date_us
------------+---------------
 31-01-2020 |             0
 01/31/2020 |             1
 05.05.2020 |             1

```

### [re_data.valid_date_inverse](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_date_inverse)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is in inversed date format.

```sql
=> select date_time, {{ re_data.valid_date_eu('date_time')}} as valid_date_inverse

 date_time  | valid_date_inverse
------------+--------------------
 31-01-2020 |                  0
 01/31/2020 |                  0
 05.05.2020 |                  0
 2020-01-31 |                  1
```

### [re_data.valid_date_iso_8601](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_date_iso_8601)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid is time format.

```sql
=> select date_time, {{ re_data.valid_date_iso_8601('date_time')}} as valid_date_iso_8601

         date_time         | valid_date_iso_8601
---------------------------+---------------------
 31-01-2020                |                   0
 2020-01-31T12:59:00+02:00 |                   1
 2020-01-31T12:59:00       |                   1
```


### [re_data.valid_time_12h](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_time_12h)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid 12h time (HH:MM) format.

```sql
=> select date_time, {{ re_data.valid_time_12h('date_time')}} as valid_time_12h

         date_time         | valid_time_12h
---------------------------+----------------
 23:59                     |              0
 12:59                     |              1
 13:59:01                  |              0
```

### [re_data.valid_time_24h](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_time_24h)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid 24h time (HH:MM) format.

```sql
=> select date_time, {{ re_data.valid_time_24h('date_time')}} as valid_time_24h

         date_time         | valid_time_24h
---------------------------+----------------
 23:59                     |              1
 12:59                     |              1
 13:59:01                  |              0
```


### [re_data.valid_time](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_time)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid time, see examples:

```sql
=> select date_time, {{ re_data.valid_time('date_time')}} as valid_time

         date_time         | valid_time
---------------------------+------------
 2020-01-31                |          0
 23:59                     |          1
 12:59                     |          1
 13:59:01                  |          1
 12:59:01,55               |          1
 11:59:00                  |          1
```

##  Numbers

### [re_data.valid_number](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_number)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid integer number.

```sql
=> select date_time, {{ re_data.valid_number('number')}} as is_number

    number    | is_number
--------------+-----------
 133          |         1
 1232.232     |         0
```


### [re_data.is_number_decimal_point](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.is_number_decimal_point)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid number with deciaml point.

```sql
=> select date_time, {{ re_data.is_number_decimal_point_decimal_point('number')}} as is_number

    number    | is_number_decimal_point
--------------+-------------------------
 133          |                       0
 1232.232     |                       1
```


### [re_data.valid_number_decimal_comma](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_number_decimal_comma)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid number with deciaml comma.

```sql
=> select date_time, {{ re_data.valid_number_decimal_comma('number')}} as is_number_decimal_comma

    number    | is_number_decimal_comma
--------------+-------------------------
 133          |                       0
 1232.232     |                       0
 2332,123     |                       1
```


### [re_data.valid_number_percentage](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_number_percentage)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is in percentage format.

```sql
=> select date_time, {{ re_data.valid_number_percentage('number')}} as number_percentage

    number    | is_percentage
--------------+---------------
 1,3%         |             1
 123%         |             1
 13  %        |             0
 76.234%      |             1
```


### [re_data.valid_number_percentage_point](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_number_percentage_point)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data in percentage format (using point for decimals).

```sql
=> select date_time, {{ re_data.valid_number_percentage_point('number')}} as is_percentage_decimal_point

    number    | is_percentage_decimal_point
--------------+-----------------------------
 1,3%         |                           0
 123%         |                           1
 13  %        |                           0
 76.234%      |                           1
```


### [re_data.valid_number_percentage_comma](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_number_percentage_comma)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data in percentage format (using comma for decimals).

```sql
=> select date_time, {{ re_data.valid_number_percentage_comma('number')}} as is_percentage_decimal_comma

    number    | is_percentage_decimal_comma
--------------+-----------------------------
 1,3%         |                           1
 123%         |                           1
 13  %        |                           0
 76.234%      |                           0
```


## IP

### [re_data.valid_ip_v4](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_ip_v4)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid ip_v4.

```sql
=> select ip_address, {{ re_data.valid_ip_v4('ip_address')}} as valid_ip_v4
               ip_address               | valid_ip_v4
----------------------------------------+-------------
 1.2.3.4                                |           1
 01.102.103.104                         |           1
 124.171.228.4                          |           1
 192.168.1.35                           |           1
 01.1.1                                 |           0
```


### [re_data.valid_ip_v6](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_ip_v6)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid ip_v6.

```sql
=> select ip_address, {{ re_data.valid_ip_v6('ip_address')}} as valid_ip_v6
               ip_address               | valid_ip_v6
----------------------------------------+-------------
 1.2.3.4                                |           0
 2001:db8:3333:4444:5555:6666:7777:8888 |           1
 2001:db8::                             |           1
 ::1234:5678                            |           1
 2001:db8::1234:5678                    |           1
 ::11.22.33.44                          |           1
 2001:db8::123.123.123.123              |           1
 2001:db8::1234:5678:5.6.7.8            |           1
 2001:db8:3333:4444:5555:6666:1.2.3.4   |           1
 ::11.22.33.44                          |           1
 2001:db8::123.123.123.123              |           1
 ::1234:5678:91.123.4.56                |           1
 ::1234:5678:1.2.3.4                    |           1
 2001:db8::1234:5678:5.6.7.8            |           1
```


### [re_data.valid_ip](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_ip)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid ip either ipv4 or ipv6.

```sql
=> select ip_address, {{ re_data.valid_ip('ip_address')}} as valid_ip
               ip_address               | valid_ip
----------------------------------------+----------
 1.2.3.4                                |        1
 232.232.33                             |        0
 232.3232.232.232+2312                  |        0
 ::::erwerwe                            |        0
 2001:db8:3333:4444:5555:6666:7777:8888 |        1
```

## Email


### [re_data.valid_email](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_email)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid email, using plus sign is not allowed (treated are error).

```sql
=> select email, {{ re_data.valid_email('email')}} as valid_email
              email              | valid_email
---------------------------------+-------------
 test@fakemail.com               |           1
 novalidemail@                   |           0
 novalidemail@com                |           0
 test+alovalidemail@fakemail.com |           0
```


## UUID


### [re_data.valid_uuid](https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.valid_uuid)
Arguments:
*column: The column to perform validation on.*

Return type: boolean

This macro checks if data is valid universally unique identifier (UUID).

```sql
=> select uuid, {{ re_data.valid_uuid('uuid')}} as valid_uuid
                 uuid                  | valid_uuid
---------------------------------------+------------
 ace1245c-3af5-11ec-8d3d-0242ac130003  |          1
 notanuid                              |          0
 d0d61836-3af5-11ec-8d3d-0242ac130003  |          1
 343422-234324-234234-4234234-23432    |          0
 343422-234324-234234-4234234-234xxx32 |          0
```


## Your ideas

If you have other suggestions of validations you would like to be supported (or you would like to add one), 
**[let us know on Slack! 😊](https://www.getre.io/slack)**
