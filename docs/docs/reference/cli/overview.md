---
sidebar_position: 0
---

# Overview

`re_data overview` cli command is used to generate & serve observability UI. 

### generate
```
re_data overview generate --start-date 2021-01-01 --end-date 2021-01-30 --interval days:1
```

Generates overview as HTML and JSON files and saves them in `target/re_data` folder of your dbt project. 

Supported argments:
- start-date (*default: today - 7 days*) - start date of period for which you generate overview
- end-date (*default: today*) - end date of period for which you generate overview
- interval (*default: days:1*) - basic time grain for the overview, supported values - *days*, *hours*, example: **days:7**, **hours:1**.

For this command to generate HTLL/JSON with data, you need to have already re_data models for chosen dates/intervals in your data warehouse. `re_data run` command or just bare `dbt run` for re_data package (can be called in your dbt Cloud env) are command to use for that.
### serve

```
re_data overview serve
```

Starts simple python server that serves HTML/JSON files generated & opens your browser 😊