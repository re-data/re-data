"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[269],{3905:(e,t,r)=>{r.d(t,{Zo:()=>c,kt:()=>m});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),d=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=d(e.components);return a.createElement(s.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=d(r),m=n,f=p["".concat(s,".").concat(m)]||p[m]||u[m]||o;return r?a.createElement(f,i(i({ref:t},c),{},{components:r})):a.createElement(f,i({ref:t},c))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=p;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,i[1]=l;for(var d=2;d<o;d++)i[d]=r[d];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}p.displayName="MDXCreateElement"},7051:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var a=r(7462),n=(r(7294),r(3905));const o={sidebar_position:2},i="Data Filtering",l={unversionedId:"re_data/reference/macros/data_filtering",id:"re_data/reference/macros/data_filtering",title:"Data Filtering",description:"Data filtering refers to the process of choosing a smaller part of your dataset and using that subset for viewing or analysis.",source:"@site/docs/re_data/reference/macros/data_filtering.md",sourceDirName:"re_data/reference/macros",slug:"/re_data/reference/macros/data_filtering",permalink:"/0.10.2/docs/re_data/reference/macros/data_filtering",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/reference/macros/data_filtering.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Data Cleaning",permalink:"/0.10.2/docs/re_data/reference/macros/data_cleaning"},next:{title:"Data Normalization",permalink:"/0.10.2/docs/re_data/reference/macros/data_normalization"}},s={},d=[{value:"filter_remove_duplicates",id:"filter_remove_duplicates",level:3},{value:"(source code)",id:"source-code",level:4},{value:"filter_get_duplicates",id:"filter_get_duplicates",level:3},{value:"(source code)",id:"source-code-1",level:4},{value:"Your ideas",id:"your-ideas",level:2}],c={toc:d};function u(e){let{components:t,...r}=e;return(0,n.kt)("wrapper",(0,a.Z)({},c,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"data-filtering"},"Data Filtering"),(0,n.kt)("p",null,"Data filtering refers to the process of choosing a smaller part of your dataset and using that subset for viewing or analysis."),(0,n.kt)("p",null,"Filtering may be used to:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Look at results for a particular period of time."),(0,n.kt)("li",{parentName:"ul"},'Exclude erroneous or "bad" observations from an analysis.'),(0,n.kt)("li",{parentName:"ul"},'Extract erroneous or "bad" observations from an analysis for manual ',(0,n.kt)("a",{parentName:"li",href:"https://www.gartner.com/en/documents/554646/best-practices-for-data-stewardship"},"(by data stewards)"),"/ ",(0,n.kt)("a",{parentName:"li",href:"https://www2.deloitte.com/nl/nl/pages/enterprise-technology-and-performance/articles/augmented-data-management-beyond-the-hype.html"},"augmented (AI)")," Data Quality Management.")),(0,n.kt)("p",null,"re_data provides the following macros for filtering data. Check out the list of currently available filters and let us know if you could use some different ones on ",(0,n.kt)("strong",{parentName:"p"},(0,n.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack \ud83d\ude0a"))," or ",(0,n.kt)("strong",{parentName:"p"},(0,n.kt)("a",{parentName:"strong",href:"https://github.com/re-data/re-data/issues/new?assignees=&labels=&template=macro_request.md&title=%5BMACRO%5D"},"Github")),"."),(0,n.kt)("h3",{id:"filter_remove_duplicates"},"filter_remove_duplicates"),(0,n.kt)("h4",{id:"source-code"},(0,n.kt)("a",{parentName:"h4",href:"https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.filter_remove_duplicates"},"(source code)")),(0,n.kt)("p",null,(0,n.kt)("em",{parentName:"p"},"Arguments:")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("em",{parentName:"li"},"relation: dbt model to perform the filtering on")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("em",{parentName:"li"},"unique_cols: List of columns that uniquely identify each row")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("em",{parentName:"li"},"sort_columns: Order in which we want to sort the partitioned rows. e.g. (created_at DESC, created_at ASC to choose the latest or earliest row based on the timestamp column"))),(0,n.kt)("p",null,"Return type: table with filtered rows"),(0,n.kt)("p",null,"This macro allows you to remove duplicate rows from a dbt model based on certain conditions."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sql"},"  id |  status      |   updated_at    |\n--------------------------------------+\n 1   |  pending     |    13:00:45     |\n 2   |  completed   |    13:05:23     |\n 1   |  completed   |    13:10:35     |\n 2   |  pending     |    13:04:49     |\n 3   |  completed   |    13:30:00     |\n\n => select id, status, updated_at from {{ re_data.filter_remove_duplicates(ref('duplicated'), ['id'], ['updated_at desc']) }} duplicates\n\n -- After filtering, the resulting rows are:\n\n  id |  status      |   updated_at    |\n--------------------------------------+\n 1   |  completed   |    13:10:35     |\n 2   |  completed   |    13:05:23     |\n 3   |  completed   |    13:30:00     |\n")),(0,n.kt)("h3",{id:"filter_get_duplicates"},"filter_get_duplicates"),(0,n.kt)("h4",{id:"source-code-1"},(0,n.kt)("a",{parentName:"h4",href:"https://re-data.github.io/dbt-re-data/#!/macro/macro.re_data.filter_get_duplicates"},"(source code)")),(0,n.kt)("p",null,(0,n.kt)("em",{parentName:"p"},"Arguments:")),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("em",{parentName:"li"},"relation: dbt base model to perform the filtering on")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("em",{parentName:"li"},"unique_cols: List of columns that uniquely identify each row")),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("em",{parentName:"li"},"sort_columns: Order in which we want to sort the partitioned rows. e.g. (created_at DESC, created_at ASC to choose the latest or earliest row based on the timestamp column"))),(0,n.kt)("p",null,"Return type: table with duplicate rows"),(0,n.kt)("p",null,"along with the fields of the base model the macro returns duplication context in new fields:\nre_data_duplicates_count - total number of duplicates with the same current key set\nre_data_duplicate_row_number - number of current duplicate row inside the group of duplicates with the same current key set"),(0,n.kt)("p",null,"This macro allows you to get duplicate rows from a dbt model based on certain conditions."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sql"},"  id |  status      |   updated_at    |\n--------------------------------------+\n 1   |  pending     |    13:00:45     |\n 2   |  completed   |    13:05:23     |\n 1   |  completed   |    13:10:35     |\n 2   |  pending     |    13:04:49     |\n 3   |  completed   |    13:30:00     |\n\n => select id, status, updated_at,\n       re_data_duplicate_group_row_count, \n       re_data_duplicate_group_row_number\n    from {{ re_data.filter_get_duplicates( ref('duplicated') , ['id'], ['updated_at desc']) }}  duplicates\n\n -- After filtering, the resulting rows are:\n\n id | updated_at |  status   | re_data_duplicate_group_row_count | re_data_duplicate_group_row_number\n----+------------+-----------+-----------------------------------+------------------------------------\n  1 | 13:10:35   | completed |                                 2 |                                  1\n  1 | 13:00:45   | pending   |                                 2 |                                  2\n  2 | 13:05:23   | completed |                                 2 |                                  1\n  2 | 13:04:49   | pending   |                                 2 |                                  2\n")),(0,n.kt)("h2",{id:"your-ideas"},"Your ideas"),(0,n.kt)("p",null,"If you have other suggestions of filtering data which you would like to be supported\n",(0,n.kt)("strong",{parentName:"p"},(0,n.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"let us know on Slack! \ud83d\ude0a"))))}u.isMDXComponent=!0}}]);