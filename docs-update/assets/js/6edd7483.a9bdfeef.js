"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[4393],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>_});var r=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function l(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,r)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?l(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):l(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function i(e,t){if(null==e)return{};var a,r,n=function(e,t){if(null==e)return{};var a,r,n={},l=Object.keys(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var l=Object.getOwnPropertySymbols(e);for(r=0;r<l.length;r++)a=l[r],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var o=r.createContext({}),u=function(e){var t=r.useContext(o),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},p=function(e){var t=u(e.components);return r.createElement(o.Provider,{value:t},e.children)},c="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var a=e.components,n=e.mdxType,l=e.originalType,o=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),c=u(a),d=n,_=c["".concat(o,".").concat(d)]||c[d]||m[d]||l;return a?r.createElement(_,s(s({ref:t},p),{},{components:a})):r.createElement(_,s({ref:t},p))}));function _(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var l=a.length,s=new Array(l);s[0]=d;var i={};for(var o in t)hasOwnProperty.call(t,o)&&(i[o]=t[o]);i.originalType=e,i[c]="string"==typeof e?e:n,s[1]=i;for(var u=2;u<l;u++)s[u]=a[u];return r.createElement.apply(null,s)}return r.createElement.apply(null,a)}d.displayName="MDXCreateElement"},2656:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>o,contentTitle:()=>s,default:()=>m,frontMatter:()=>l,metadata:()=>i,toc:()=>u});var r=a(7462),n=(a(7294),a(3905));const l={sidebar_position:1},s="Asserts",i={unversionedId:"re_data/reference/tests/asserts",id:"re_data/reference/tests/asserts",title:"Asserts",description:"re_data comes with asserts library, created to test metrics computed.",source:"@site/docs/re_data/reference/tests/asserts.md",sourceDirName:"re_data/reference/tests",slug:"/re_data/reference/tests/asserts",permalink:"/docs-update/docs/re_data/reference/tests/asserts",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/reference/tests/asserts.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Table Samples",permalink:"/docs-update/docs/re_data/reference/table_samples"},next:{title:"Tests history",permalink:"/docs-update/docs/re_data/reference/tests/history"}},o={},u=[{value:"assert_true",id:"assert_true",level:3},{value:"assert_false",id:"assert_false",level:3},{value:"assert_in_range",id:"assert_in_range",level:3},{value:"assert_equal",id:"assert_equal",level:3},{value:"assert_greater",id:"assert_greater",level:3},{value:"assert_greater_equal",id:"assert_greater_equal",level:3},{value:"assert_less",id:"assert_less",level:3},{value:"assert_less_equal",id:"assert_less_equal",level:3}],p={toc:u},c="wrapper";function m(e){let{components:t,...a}=e;return(0,n.kt)(c,(0,r.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"asserts"},"Asserts"),(0,n.kt)("p",null,"re_data comes with asserts library, created to test metrics computed.\nYou can use those as tests in ",(0,n.kt)("inlineCode",{parentName:"p"},"schema.yml")," of every model monitored by re_data."),(0,n.kt)("p",null,"re_data asserts can be applied both as table and column level tests as show in the example."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sql",metastring:'title="schema.yml"',title:'"schema.yml"'},"version: 2\n\nmodels:\n  - name: buy_events\n    tests:\n      - re_data.assert_in_range:\n          metric: row_count\n          min_value: 0\n          max_value: 10\n\n    columns:\n      - name: value1\n        tests:\n          - re_data.assert_true:\n              metric: nulls_percent\n              expression: value = 0\n\n      - name: value2\n        tests:\n          - re_data.assert_greater:\n              metric: min\n              value: 200\n              condition: time_window_start >= '2020-05-02'\n\n")),(0,n.kt)("admonition",{type:"info"},(0,n.kt)("p",{parentName:"admonition"},"Asserts have a set of standard params with the same meaning in all tests:"),(0,n.kt)("ul",{parentName:"admonition"},(0,n.kt)("li",{parentName:"ul"},"metric: name of the metric you are testing"),(0,n.kt)("li",{parentName:"ul"},"expression: an expression which re_data will evaluate to be true or false. Use ",(0,n.kt)("inlineCode",{parentName:"li"},"value")," to indicate the value of a metric computed. Example expression: ",(0,n.kt)("inlineCode",{parentName:"li"},"value > 0")," asserts that metric is greater than 0"),(0,n.kt)("li",{parentName:"ul"},"value - a number to which you would like to compare metric. Example: ",(0,n.kt)("inlineCode",{parentName:"li"},"value: 5")," in the ",(0,n.kt)("inlineCode",{parentName:"li"},"assert_greater")," test would check if all metric values are larger than 5"),(0,n.kt)("li",{parentName:"ul"},"min_value, max_value - similarly to ",(0,n.kt)("inlineCode",{parentName:"li"},"value")," re_data will compare metric values to values passed here"),(0,n.kt)("li",{parentName:"ul"},"condition: (optional) time filter for the metric, if you would like to tests only metric from specific time range. User ",(0,n.kt)("inlineCode",{parentName:"li"},"time_window_start")," or ",(0,n.kt)("inlineCode",{parentName:"li"},"time_window_end")," to compare against time. Example: ",(0,n.kt)("inlineCode",{parentName:"li"},"time_window_start > '2020-05-02'")," will check only metrics computed later than on '2020-05-02'"))),(0,n.kt)("h3",{id:"assert_true"},"assert_true"),(0,n.kt)("p",null,"Accepted params:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"metric"),(0,n.kt)("li",{parentName:"ul"},"expression"),(0,n.kt)("li",{parentName:"ul"},"condition")),(0,n.kt)("p",null,"Assert that given expression is true for the metric computed."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"- re_data.assert_true:\n    metric: nulls_percent\n    expression: value = 0\n    condition: time_window_start >= '2020-05-02' # (optinal)\n")),(0,n.kt)("h3",{id:"assert_false"},"assert_false"),(0,n.kt)("p",null,"Accepted params:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"metric"),(0,n.kt)("li",{parentName:"ul"},"expression"),(0,n.kt)("li",{parentName:"ul"},"condition")),(0,n.kt)("p",null,"Assert that given expression is false for the metric computed."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"- re_data.assert_false:\n    metric: freshness\n    expression: value is null\n")),(0,n.kt)("h3",{id:"assert_in_range"},"assert_in_range"),(0,n.kt)("p",null,"Accepted params:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"metric"),(0,n.kt)("li",{parentName:"ul"},"min_value"),(0,n.kt)("li",{parentName:"ul"},"max_value"),(0,n.kt)("li",{parentName:"ul"},"condition")),(0,n.kt)("p",null,"Assert that metric value is between min_value and max_value (inclusive)"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"- re_data.assert_in_range:\n    metric: row_count\n    min_value: 0\n    max_value: 10\n")),(0,n.kt)("h3",{id:"assert_equal"},"assert_equal"),(0,n.kt)("p",null,"Accepted params:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"metric"),(0,n.kt)("li",{parentName:"ul"},"value"),(0,n.kt)("li",{parentName:"ul"},"condition")),(0,n.kt)("p",null,"Assert that metric value is equal to specified value"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"- re_data.assert_equal:\n    metric: row_count\n    value: 1\n")),(0,n.kt)("h3",{id:"assert_greater"},"assert_greater"),(0,n.kt)("p",null,"Accepted params:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"metric"),(0,n.kt)("li",{parentName:"ul"},"value"),(0,n.kt)("li",{parentName:"ul"},"condition")),(0,n.kt)("p",null,"Assert that metric value is greater to specified value"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"- re_data.assert_greater:\n    metric: min\n    value: 200\n")),(0,n.kt)("h3",{id:"assert_greater_equal"},"assert_greater_equal"),(0,n.kt)("p",null,"Accepted params:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"metric"),(0,n.kt)("li",{parentName:"ul"},"value"),(0,n.kt)("li",{parentName:"ul"},"condition")),(0,n.kt)("p",null,"Assert that metric value is greater or equal specified value"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"- re_data.assert_greater_equal:\n    metric: my_distinct_table_rows\n    value: 10\n")),(0,n.kt)("h3",{id:"assert_less"},"assert_less"),(0,n.kt)("p",null,"Accepted params:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"metric"),(0,n.kt)("li",{parentName:"ul"},"value"),(0,n.kt)("li",{parentName:"ul"},"condition")),(0,n.kt)("p",null,"Assert that metric value is smaller specified value"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"- re_data.assert_less:\n    metric: min\n    value: 100\n")),(0,n.kt)("h3",{id:"assert_less_equal"},"assert_less_equal"),(0,n.kt)("p",null,"Accepted params:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"metric"),(0,n.kt)("li",{parentName:"ul"},"value"),(0,n.kt)("li",{parentName:"ul"},"condition")),(0,n.kt)("p",null,"Assert that metric value is smaller or equal to specified value"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"- re_data.assert_less_equal:\n    metric: min\n    value: 107\n")),(0,n.kt)("p",null,"If you would like us to add some other tests, information about tests history, etc., join ",(0,n.kt)("strong",{parentName:"p"},(0,n.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a"))," and let us know! \ud83d\ude0a"))}m.isMDXComponent=!0}}]);