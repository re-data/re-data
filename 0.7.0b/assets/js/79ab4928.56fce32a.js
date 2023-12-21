"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[790],{3905:function(e,t,a){a.d(t,{Zo:function(){return i},kt:function(){return p}});var r=a(7294);function s(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function n(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){s(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function _(e,t){if(null==e)return{};var a,r,s=function(e,t){if(null==e)return{};var a,r,s={},o=Object.keys(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||(s[a]=e[a]);return s}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)a=o[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(s[a]=e[a])}return s}var d=r.createContext({}),l=function(e){var t=r.useContext(d),a=t;return e&&(a="function"==typeof e?e(t):n(n({},t),e)),a},i=function(e){var t=l(e.components);return r.createElement(d.Provider,{value:t},e.children)},c={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var a=e.components,s=e.mdxType,o=e.originalType,d=e.parentName,i=_(e,["components","mdxType","originalType","parentName"]),m=l(a),p=s,u=m["".concat(d,".").concat(p)]||m[p]||c[p]||o;return a?r.createElement(u,n(n({ref:t},i),{},{components:a})):r.createElement(u,n({ref:t},i))}));function p(e,t){var a=arguments,s=t&&t.mdxType;if("string"==typeof e||s){var o=a.length,n=new Array(o);n[0]=m;var _={};for(var d in t)hasOwnProperty.call(t,d)&&(_[d]=t[d]);_.originalType=e,_.mdxType="string"==typeof e?e:s,n[1]=_;for(var l=2;l<o;l++)n[l]=a[l];return r.createElement.apply(null,n)}return r.createElement.apply(null,a)}m.displayName="MDXCreateElement"},3516:function(e,t,a){a.r(t),a.d(t,{assets:function(){return i},contentTitle:function(){return d},default:function(){return p},frontMatter:function(){return _},metadata:function(){return l},toc:function(){return c}});var r=a(7462),s=a(3366),o=(a(7294),a(3905)),n=["components"],_={sidebar_position:5},d="Models",l={unversionedId:"reference/models",id:"reference/models",title:"Models",description:"All data produced by re_data is saved in dbt models. Here we describe what those models mean and show some sample data they contain.",source:"@site/docs/reference/models.md",sourceDirName:"reference",slug:"/reference/models",permalink:"/0.7.0b/docs/reference/models",editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/reference/models.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Data Validation",permalink:"/0.7.0b/docs/reference/macros/data_validation"},next:{title:"Anonymous data collection",permalink:"/0.7.0b/docs/reference/anonymous_usage"}},i={},c=[{value:"re_data_metrics",id:"re_data_metrics",level:3},{value:"re_data_schema_changes",id:"re_data_schema_changes",level:3},{value:"re_data_monitored",id:"re_data_monitored",level:3},{value:"re_data_z_score",id:"re_data_z_score",level:3},{value:"re_data_anomalies",id:"re_data_anomalies",level:3},{value:"re_data_alerts",id:"re_data_alerts",level:3},{value:"re_data_test_history",id:"re_data_test_history",level:3}],m={toc:c};function p(e){var t=e.components,a=(0,s.Z)(e,n);return(0,o.kt)("wrapper",(0,r.Z)({},m,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"models"},"Models"),(0,o.kt)("p",null,"All data produced by re_data is saved in dbt models. Here we describe what those models mean and show some sample data they contain."),(0,o.kt)("h3",{id:"re_data_metrics"},"re_data_metrics"),(0,o.kt)("p",null,"This model contains (almost all - except schema changes) metrics computed by re_data. Here is what this table looks like:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sql",metastring:'title="re_data_metrics"',title:'"re_data_metrics"'},'                id                |               table_name               | column_name |    metric     |       value        |  time_window_start  |   time_window_end   | interval_length_sec |        computed_on\n----------------------------------+----------------------------------------+-------------+---------------+--------------------+---------------------+---------------------+---------------------+----------------------------\n 84a9d139c54fc726e9422506bf801a17 | "postgres"."toy_shop"."orders_per_age" | amount      | min           |                 52 | 2021-01-04 00:00:00 | 2021-01-05 00:00:00 |               86400 | 2022-01-20 13:51:34.054734\n ccca51c65ff39fb1597369466f50d184 | "postgres"."toy_shop"."orders_per_age" | amount      | max           |                200 | 2021-01-04 00:00:00 | 2021-01-05 00:00:00 |               86400 | 2022-01-20 13:51:34.054734\n 91cbf631c912879568c872bb85072329 | "postgres"."toy_shop"."orders_per_age" | amount      | avg           | 124.99378881987577 | 2021-01-04 00:00:00 | 2021-01-05 00:00:00 |               86400 | 2022-01-20 13:51:34.054734\n aa76192540ae52a22eb7272477b8a9ca | "postgres"."toy_shop"."orders_per_age" | amount      | stddev        | 42.942621149391016 | 2021-01-04 00:00:00 | 2021-01-05 00:00:00 |               86400 | 2022-01-20 13:51:34.054734\n ad4a2c8483217a748cdc520f159ba239 | "postgres"."toy_shop"."orders_per_age" | amount      | nulls_percent |                  0 | 2021-01-04 00:00:00 | 2021-01-05 00:00:00 |               86400 | 2022-01-20 13:51:34.054734\n')),(0,o.kt)("h3",{id:"re_data_schema_changes"},"re_data_schema_changes"),(0,o.kt)("p",null,"Schema changes are computed separately. This model contains all detected schema changes."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sql",metastring:'title="re_data_schema_changes"',title:'"re_data_schema_changes"'},'                id                |                     table_name                     |   operation    | column_name |          data_type          | is_nullable | prev_column_name |       prev_data_type        | prev_is_nullable |       detected_time\n----------------------------------+----------------------------------------------------+----------------+-------------+-----------------------------+-------------+------------------+-----------------------------+------------------+----------------------------\n d7d0a39b324e4e073d75783cd4f66b61 | "postgres"."toy_shop_sources"."toy_shop_customers" | column_added   | last_name   | text                        | t           |                  |                             |                  | 2022-01-20 11:53:01.779986\n 2c752a1614e50740a4e18f04528026f7 | "postgres"."toy_shop_sources"."toy_shop_customers" | column_added   | first_name  | text                        | t           |                  |                             |                  | 2022-01-20 11:53:01.779986\n d5b02ec481a1a032ea1e7a06d3c11402 | "postgres"."toy_shop_sources"."toy_shop_customers" | column_added   | joined_at   | timestamp without time zone | t           |                  |                             |                  | 2022-01-20 11:53:01.779986\n')),(0,o.kt)("h3",{id:"re_data_monitored"},"re_data_monitored"),(0,o.kt)("p",null,"This model refreshes each time re_data runs and describes what tables re_data monitors. It is generated from your configuration."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sql",metastring:'title="re_data_monitored"',title:'"re_data_monitored"'},'        name        |      schema      | database | time_filter |                                  metrics                                   |       columns\n--------------------+------------------+----------+-------------+----------------------------------------------------------------------------+----------------------\n pending_orders     | toy_shop         | postgres | created_at  | {"table": ["orders_above_100"], "column": {"status": ["distinct_values"]}} | ["amount", "status"]\n revenue_per_age    | toy_shop         | postgres | created_at  | {}                                                                         | []\n orders_per_age     | toy_shop         | postgres | created_at  | {"table": ["orders_above_100"], "columns": ["amount", "status", "age"]}    | []\n orders             | toy_shop         | postgres | created_at  | {"table": ["orders_above_100"], "column": {"status": ["distinct_values"]}} | []\n order_items        | toy_shop         | postgres | added_at    | {}                                                                         | ["name", "amount"]\n toy_shop_customers | toy_shop_sources | postgres | joined_at   | {}                                                                         | []\n')),(0,o.kt)("h3",{id:"re_data_z_score"},"re_data_z_score"),(0,o.kt)("p",null,"Computed z_score for metric. ",(0,o.kt)("inlineCode",{parentName:"p"},"re_data")," looks back on what where metrics values in last 30 days and compute z_score for newest value."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sql",metastring:'title="re_data_z_score"',title:'"re_data_z_score"'},'                id                |               table_name               | column_name |    metric     |    z_score_value    |    last_value     |      last_avg      |    last_stddev     |   time_window_end   | interval_length_sec |        computed_on\n----------------------------------+----------------------------------------+-------------+---------------+---------------------+-------------------+--------------------+--------------------+---------------------+---------------------+----------------------------\n f19be3406e37defc007e6f24ff25e5b5 | "postgres"."toy_shop"."orders_per_age" | amount      | min           |  0.2214037213556089 |                51 | 50.833333333333336 |  0.752772652709081 | 2021-01-07 00:00:00 |               86400 | 2022-01-20 13:52:05.820813\n 8023fc1960181e10b3116d2df757e550 | "postgres"."toy_shop"."orders_per_age" | amount      | max           | -2.0412414521526485 |               197 |              199.5 |  1.224744871391589 | 2021-01-07 00:00:00 |               86400 | 2022-01-20 13:52:05.820813\n 7074d2eb212a05eb6f8762221501f9ed | "postgres"."toy_shop"."orders_per_age" | amount      | avg           | -0.9565569719919818 |          123.1625 | 125.10441589695779 | 2.0301100234711553 | 2021-01-07 00:00:00 |               86400 | 2022-01-20 13:52:05.820813\n ee322e502d1cb8d9dbf7375114f6854e | "postgres"."toy_shop"."orders_per_age" | amount      | stddev        | -1.5344203467771198 | 41.82321095806451 |  42.98880644751242 | 0.7596324512658293 | 2021-01-07 00:00:00 |               86400 | 2022-01-20 13:52:05.820813\n 4e68493c3cf5d0390374770f9729d645 | "postgres"."toy_shop"."orders_per_age" | amount      | nulls_percent |                   0 |                 0 |                  0 |                  0 | 2021-01-07 00:00:00 |               86400 | 2022-01-20 13:52:05.820813\n')),(0,o.kt)("h3",{id:"re_data_anomalies"},"re_data_anomalies"),(0,o.kt)("p",null,"View computed on top of ",(0,o.kt)("inlineCode",{parentName:"p"},"re_data_z_score")," table to contain metrics that look alerting. Alerting threshold is controlled by var ",(0,o.kt)("inlineCode",{parentName:"p"},"re_data:alerting_z_score"),"\nwhich is equal to 3 by default, but can be changed and adjusted."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sql",metastring:'title="re_data_anomalies"',title:'"re_data_anomalies"'},'               id                |               table_name               | column_name |    metric     |    z_score_value    |     last_value     |      last_avg       |     last_stddev     |   time_window_end   | interval_length_sec |        computed_on         |\n----------------------------------+----------------------------------------+-------------+---------------+---------------------+--------------------+---------------------+---------------------+---------------------+---------------------+----------------------------+----\n 6098a342fe83399b695208112a97cb34 | "postgres"."toy_shop"."order_items"    |             | freshness     |  3.0867937457815877 |               2048 |  422.89473684210526 |   526.4703109426908 | 2021-01-20 00:00:00 |               86400 | 2022-01-20 13:54:56.63893  | fre\n 17a28b0294c10e7f2e2f882e7b6f790c | "postgres"."toy_shop"."pending_orders" |             | freshness     |  3.5280241130823335 |              15951 |  3270.2380952380954 |  3594.2957015910906 | 2021-01-22 00:00:00 |               86400 | 2022-01-20 13:55:26.320726 | fre\n a1aa9974176c90468c641cf47683d613 | "postgres"."toy_shop"."orders_per_age" | status      | min_length    |    -4.2485291562996 |                  2 |                 3.9 | 0.44721359549995787 | 2021-01-21 00:00:00 |               86400 | 2022-01-20 13:55:11.294556 | min\n 82c65b49c56403cde1a8423fc7ace1bf | "postgres"."toy_shop"."orders_per_age" | amount      | nulls_percent |   4.248529154190601 | 0.6211180124223602 | 0.03105590062111801 |  0.1388862097825956 | 2021-01-21 00:00:00 |               86400 | 2022-01-20 13:55:11.294556 | nul\n 08587b89627fb1562bcf49fa2e72d881 | "postgres"."toy_shop"."customers"      | age         | min           | -3.4050793706927704 |                  0 |                20.9 |   6.137889230877852 | 2021-01-21 00:00:00 |               86400 | 2022-01-20 13:55:11.294556 | min\n')),(0,o.kt)("h3",{id:"re_data_alerts"},"re_data_alerts"),(0,o.kt)("p",null,"View with all alerts (anomalies & schema changes) formatted the same way as in re_data UI. "),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sql",metastring:'title="re_data_alerts"',title:'"re_data_alerts"'},"     type      |                    model                     |                              message                               |   value    |      time_window_end\n---------------+----------------------------------------------+--------------------------------------------------------------------+------------+----------------------------\n anomaly       | postgres.toy_shop_sources.toy_shop_customers | avg(age) is 44.06% less than average.                              | 22.89      | 2021-01-21 00:00:00\n anomaly       | postgres.toy_shop_sources.toy_shop_customers | stddev(age) is 54.45% greater than average.                        | 22.21      | 2021-01-21 00:00:00\n anomaly       | postgres.toy_shop.customers                  | min_length(first_name) is 31.58% greater than average.             | 4.00       | 2021-01-26 00:00:00\n anomaly       | postgres.toy_shop_sources.toy_shop_customers | min_length(first_name) is 31.58% greater than average.             | 4.00       | 2021-01-26 00:00:00\n anomaly       | postgres.toy_shop_sources.toy_shop_customers | freshness is 285.20% greater than average.                         | 7.97 hours | 2021-01-23 00:00:00\n anomaly       | postgres.toy_shop.customers                  | freshness is 285.20% greater than average.                         | 7.97 hours | 2021-01-23 00:00:00\n schema_change | postgres.toy_shop_sources.toy_shop_customers | column last_name of type text was added.                           |            | 2022-01-20 11:53:01.779986\n schema_change | postgres.toy_shop_sources.toy_shop_customers | column first_name of type text was added.                          |            | 2022-01-20 11:53:01.779986\n")),(0,o.kt)("h3",{id:"re_data_test_history"},"re_data_test_history"),(0,o.kt)("p",null,"A table containing all test results monitored by re_data."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-sql",metastring:'title="re_data_test_history"',title:'"re_data_test_history"'},"        table_name        | column_name |                                 test_name                                  | status |       run_at\n--------------------------+-------------+----------------------------------------------------------------------------+--------+---------------------\n postgres.toy_shop.orders | amount      | not_null_orders_amount                                                     | Fail   | 2022-01-13 08:49:39\n postgres.toy_shop.orders | status      | accepted_values_orders_status__pending__shipped__delivered__not_paid__paid | Fail   | 2022-01-13 08:49:39\n postgres.toy_shop.orders | customer_id | not_null_orders_customer_id                                                | Pass   | 2022-01-13 08:49:39\n postgres.toy_shop.orders | created_at  | not_null_orders_created_at                                                 | Pass   | 2022-01-13 08:49:39\n postgres.toy_shop.orders | status      | not_null_orders_status                                                     | Pass   | 2022-01-13 08:49:39\n")),(0,o.kt)("div",{className:"admonition admonition-caution alert alert--warning"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"16",height:"16",viewBox:"0 0 16 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M8.893 1.5c-.183-.31-.52-.5-.887-.5s-.703.19-.886.5L.138 13.499a.98.98 0 0 0 0 1.001c.193.31.53.501.886.501h13.964c.367 0 .704-.19.877-.5a1.03 1.03 0 0 0 .01-1.002L8.893 1.5zm.133 11.497H6.987v-2.003h2.039v2.003zm0-3.004H6.987V5.987h2.039v4.006z"}))),"caution")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("p",{parentName:"div"},"Some of re_data models will be subject to change in the future, if you are writing code that depends on those models consider joining our ",(0,o.kt)("a",{parentName:"p",href:"https://www.getre.io/slack"},"Slack")," and letting us know. We should be able to tell a bit more about what/when etc. may change and what to expect from the future releases."))))}p.isMDXComponent=!0}}]);