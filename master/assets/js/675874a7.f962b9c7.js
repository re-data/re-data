"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1062],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>_});var s=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);t&&(s=s.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,s)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function i(e,t){if(null==e)return{};var r,s,a=function(e,t){if(null==e)return{};var r,s,a={},n=Object.keys(e);for(s=0;s<n.length;s++)r=n[s],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(s=0;s<n.length;s++)r=n[s],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=s.createContext({}),d=function(e){var t=s.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},c=function(e){var t=d(e.components);return s.createElement(l.Provider,{value:t},e.children)},u="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return s.createElement(s.Fragment,{},t)}},f=s.forwardRef((function(e,t){var r=e.components,a=e.mdxType,n=e.originalType,l=e.parentName,c=i(e,["components","mdxType","originalType","parentName"]),u=d(r),f=a,_=u["".concat(l,".").concat(f)]||u[f]||p[f]||n;return r?s.createElement(_,o(o({ref:t},c),{},{components:r})):s.createElement(_,o({ref:t},c))}));function _(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var n=r.length,o=new Array(n);o[0]=f;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:a,o[1]=i;for(var d=2;d<n;d++)o[d]=r[d];return s.createElement.apply(null,o)}return s.createElement.apply(null,r)}f.displayName="MDXCreateElement"},4875:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>p,frontMatter:()=>n,metadata:()=>i,toc:()=>d});var s=r(7462),a=(r(7294),r(3905));const n={sidebar_position:2},o="Tests history",i={unversionedId:"re_data/reference/tests/history",id:"re_data/reference/tests/history",title:"Tests history",description:"redata can store dbt tests history into your data warehouse and visualize details of it in redata UI.",source:"@site/docs/re_data/reference/tests/history.md",sourceDirName:"re_data/reference/tests",slug:"/re_data/reference/tests/history",permalink:"/master/docs/re_data/reference/tests/history",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/reference/tests/history.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Asserts",permalink:"/master/docs/re_data/reference/tests/asserts"},next:{title:"Data Cleaning",permalink:"/master/docs/re_data/reference/macros/data_cleaning"}},l={},d=[{value:"Config",id:"config",level:2},{value:"<code>re_data:save_test_history</code> (default false)",id:"re_datasave_test_history-default-false",level:4},{value:"Tests view",id:"tests-view",level:2},{value:"Test details",id:"test-details",level:2},{value:"re_data_test_history",id:"re_data_test_history",level:2}],c={toc:d},u="wrapper";function p(e){let{components:t,...n}=e;return(0,a.kt)(u,(0,s.Z)({},c,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"tests-history"},"Tests history"),(0,a.kt)("p",null,"re_data can store dbt tests history into your data warehouse and visualize details of it in re_data UI."),(0,a.kt)("h2",{id:"config"},"Config"),(0,a.kt)("p",null,"re_data comes with 3 config options to configure:"),(0,a.kt)("h4",{id:"re_datasave_test_history-default-false"},(0,a.kt)("inlineCode",{parentName:"h4"},"re_data:save_test_history")," (default false)"),(0,a.kt)("p",null,"by default re_data doesn't store tests history to enable this you would need to set this var to ",(0,a.kt)("inlineCode",{parentName:"p"},"true")),(0,a.kt)("p",null,"Example test history configuration:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml",metastring:"dbt_project.yml","dbt_project.yml":!0},"vars:\n  re_data:save_test_history: true\n")),(0,a.kt)("admonition",{type:"caution"},(0,a.kt)("p",{parentName:"admonition"},"re_data uses on-run-end hooks for dbt tests to save the tests data. This is only available in dbt versions 1.0.0 or newer.")),(0,a.kt)("h2",{id:"tests-view"},"Tests view"),(0,a.kt)("p",null,"Tests view lets you see the history of all dbt tests run. You can filter on the table, time, etc."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"GraphExample",src:r(2156).Z,width:"1566",height:"839"})),(0,a.kt)("h2",{id:"test-details"},"Test details"),(0,a.kt)("p",null,"Tests detail view lets you see the history of a single tests over time. It shows number of failures, SQL code run and failure rows."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"GraphExample",src:r(2156).Z,width:"1566",height:"839"})),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"To see failing rows from tests you would need to run dbt test with ",(0,a.kt)("inlineCode",{parentName:"p"},"--store-failures")," config option.")),(0,a.kt)("h2",{id:"re_data_test_history"},"re_data_test_history"),(0,a.kt)("p",null,"re_data test history model contains information about tests and their stats."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-sql"},"select * from toy_shop_re.re_data_test_history\n        table_name        | column_name |                                 test_name                                  | status |       run_at\n--------------------------+-------------+----------------------------------------------------------------------------+--------+---------------------\n postgres.toy_shop.orders | amount      | not_null_orders_amount                                                     | Fail   | 2022-01-13 08:49:39\n postgres.toy_shop.orders | status      | accepted_values_orders_status__pending__shipped__delivered__not_paid__paid | Fail   | 2022-01-13 08:49:39\n postgres.toy_shop.orders | customer_id | not_null_orders_customer_id                                                | Pass   | 2022-01-13 08:49:39\n postgres.toy_shop.orders | created_at  | not_null_orders_created_at                                                 | Pass   | 2022-01-13 08:49:39\n postgres.toy_shop.orders | status      | not_null_orders_status                                                     | Pass   | 2022-01-13 08:49:39\n")))}p.isMDXComponent=!0},2156:(e,t,r)=>{r.d(t,{Z:()=>s});const s=r.p+"assets/images/tests-5fa038cf9e4af79a7c85ce16707c199c.png"}}]);