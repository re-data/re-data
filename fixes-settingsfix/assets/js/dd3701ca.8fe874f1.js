"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8927],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>g});var n=a(7294);function r(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(Object(a),!0).forEach((function(t){r(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,n,r=function(e,t){if(null==e)return{};var a,n,r={},o=Object.keys(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||(r[a]=e[a]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)a=o[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(r[a]=e[a])}return r}var s=n.createContext({}),d=function(e){var t=n.useContext(s),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=d(e.components);return n.createElement(s.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,r=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=d(a),m=r,g=u["".concat(s,".").concat(m)]||u[m]||c[m]||o;return a?n.createElement(g,i(i({ref:t},p),{},{components:a})):n.createElement(g,i({ref:t},p))}));function g(e,t){var a=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=a.length,i=new Array(o);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[u]="string"==typeof e?e:r,i[1]=l;for(var d=2;d<o;d++)i[d]=a[d];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},8622:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var n=a(7462),r=(a(7294),a(3905));const o={sidebar_position:1},i="Quickstart - dbt users",l={unversionedId:"re_data/getting_started/installation/for_dbt_users",id:"re_data/getting_started/installation/for_dbt_users",title:"Quickstart - dbt users",description:"This introduction assumes you are already using dbt in your company and tables you would like to monitor are managed by dbt.",source:"@site/docs/re_data/getting_started/installation/for_dbt_users.md",sourceDirName:"re_data/getting_started/installation",slug:"/re_data/getting_started/installation/for_dbt_users",permalink:"/fixes-settingsfix/docs/re_data/getting_started/installation/for_dbt_users",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/getting_started/installation/for_dbt_users.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Integrations",permalink:"/fixes-settingsfix/docs/re_data/introduction/integrations"},next:{title:"Quickstart - new to dbt",permalink:"/fixes-settingsfix/docs/re_data/getting_started/installation/new_to_dbt"}},s={},d=[{value:"Installing re_data dbt package",id:"installing-re_data-dbt-package",level:2},{value:"Configuring tables",id:"configuring-tables",level:3},{value:"dbt package functionality",id:"dbt-package-functionality",level:3},{value:"Computing first metrics",id:"computing-first-metrics",level:3},{value:"Storing tests history (optional)",id:"storing-tests-history-optional",level:3},{value:"Installing re_data python package",id:"installing-re_data-python-package",level:2},{value:"Python package functionality",id:"python-package-functionality",level:3},{value:"Generate &amp; Serve UI",id:"generate--serve-ui",level:3},{value:"Learning more",id:"learning-more",level:2}],p={toc:d};function u(e){let{components:t,...a}=e;return(0,r.kt)("wrapper",(0,n.Z)({},p,a,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"quickstart---dbt-users"},"Quickstart - dbt users"),(0,r.kt)("p",null,"This introduction assumes you are already using dbt in your company and tables you would like to monitor are managed by dbt.\nTo fully use re_data you would need to install both:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("a",{parentName:"strong",href:"#installing-re_data-dbt-package"},"re_data dbt package"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("a",{parentName:"strong",href:"#installing-re_data-python-package"},"re_data python package")))),(0,r.kt)("p",null,"We'll go over the steps required to do that & explain what possibilities those packages create for you."),(0,r.kt)("h2",{id:"installing-re_data-dbt-package"},"Installing re_data dbt package"),(0,r.kt)("p",null,"Add the re_data dbt package to your main dbt repo project.\nYou need to update your ",(0,r.kt)("inlineCode",{parentName:"p"},"packages.yml")," file with re_data package like that:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yml",metastring:'title="packages.yml"',title:'"packages.yml"'},'\npackages:\n    ***\n    \n    - package: re-data/re_data\n      version: [">=0.10.0", "<0.11.0"]\n\n')),(0,r.kt)("p",null,"And then install dbt packages dependencies by running:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"dbt deps\n")),(0,r.kt)("p",null,"You can do that locally, in your dbt cloud environment, or Airflow etc. scheduler enviornment."),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"On production, you most likely are already running ",(0,r.kt)("inlineCode",{parentName:"p"},"dbt deps")," as part of dbt models computation. So this step maybe only necessary for your local environment.")),(0,r.kt)("h3",{id:"configuring-tables"},"Configuring tables"),(0,r.kt)("p",null,"Computing metrics & anomalies for your dbt models & sources requires configuring them to be observed by re_data. You can do it in a couple of ways, all of them described in ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/reference/config"},"re_data configuration"))," reference part. A simple configuration for a single model contains just information that the model should be monitored & timestamp expression (usually column name) to be used when computing re_data time-based stats."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-sql",metastring:'title="<model_name>.sql"',title:'"<model_name>.sql"'},"{{\n    config(\n      re_data_monitored=true,\n      re_data_time_filter='time_column_name',\n    )\n}}\nselect ...\n")),(0,r.kt)("h3",{id:"dbt-package-functionality"},"dbt package functionality"),(0,r.kt)("p",null,"Let's go over some of the things you already can use with re_data dbt package."),(0,r.kt)("p",null,"For specifics look into reference section:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/reference/models"},"re_data dbt models"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/reference/metrics/overview_metric"},"re_data metrics"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/reference/tests/asserts"},"re_data asserts"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/reference/tests/history"},"re_data tests history"))),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/reference/macros/data_cleaning"},"re_data data cleaning, filtering, normalization, validation macros")))),(0,r.kt)("p",null,"dbt auto generated documentation, together with our models graph is also available: ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("a",{parentName:"strong",href:"https://re-data.github.io/dbt-re-data/#!/model/model.re_data.re_data_monitored"},"here"))),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"re_data macros don't require any configuration and can be just used after you add re_data into your environment.")),(0,r.kt)("h3",{id:"computing-first-metrics"},"Computing first metrics"),(0,r.kt)("p",null,"To compute re_data models containing metrics & anomalies you can just run standard dbt command."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"dbt run --models package:re_data\n")),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"single re_data run produces single data points about your tables for a time window. The default time window when you run re_data without parameters is yesterday. (from yesterday's 00:00 AM up until today 00:00 AM) To compare tables over time you would need to run the re_data dbt package multiple times (by some scheduler, re_data python package or manually).")),(0,r.kt)("p",null,"The following would create tables inside your ",(0,r.kt)("inlineCode",{parentName:"p"},"{default_schema}_re")," schema of your database. This is configured in dbt and can be overwritten in your ",(0,r.kt)("inlineCode",{parentName:"p"},"dbt_project.yml"),"."),(0,r.kt)("h3",{id:"storing-tests-history-optional"},"Storing tests history (optional)"),(0,r.kt)("p",null,"re_data enables you to store dbt tests results to investigate them later on. You can enable this functionality by setting:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yml",metastring:"dbt_project.yml","dbt_project.yml":!0},"vars:\n  re_data:save_test_history: true\n")),(0,r.kt)("p",null,"In your ",(0,r.kt)("inlineCode",{parentName:"p"},"dbt_project.yml")," file. After that when you run:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"dbt test\n")),(0,r.kt)("p",null,"re_data will store test history and with option ",(0,r.kt)("inlineCode",{parentName:"p"},"--store-failures")," is added, it will also store failures in ",(0,r.kt)("inlineCode",{parentName:"p"},"re_data_test_history")," model."),(0,r.kt)("h2",{id:"installing-re_data-python-package"},"Installing re_data python package"),(0,r.kt)("p",null,"To generate re_data reliability UI, send re_data alerts to Slack and easily backfill re_data models you will need to install the re_data python library. For this step, you need to have a python environment (with dbt installation) setup. Install re_data by executing:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"pip install re_data\n")),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"re_data python library should be installed in the same python environment where your dbt is installed. re_data makes use of dbt to run queries against your database. Because of that, you don't need to pass any DB credentials to re_data configuration. re_data by default will run dbt with the same credentials & profiles which you have in your ",(0,r.kt)("inlineCode",{parentName:"p"},"dbt_project.yml")," and ",(0,r.kt)("inlineCode",{parentName:"p"},"~/.dbt/profiles.yml")," files. You can also change this behaviour by passing options to the re_data command.")),(0,r.kt)("h3",{id:"python-package-functionality"},"Python package functionality"),(0,r.kt)("p",null,"Python package add enabled you to use this functionality:"),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/reference/cli/overview"},"re_data overview UI"))," - for generating & displaying re_data UI"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/reference/cli/notify"},"re_data notify"))," - for notifying external services about alerts (currently Slack)"),(0,r.kt)("li",{parentName:"ul"},(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/reference/cli/run"},"re_data run"))," - for easily backfilling re_data dbt data")),(0,r.kt)("h3",{id:"generate--serve-ui"},"Generate & Serve UI"),(0,r.kt)("p",null,"Let's go over 2 commands for generating & serving UI. It works quite similarly to dbt docs. First you create files by calling ",(0,r.kt)("inlineCode",{parentName:"p"},"re_data overview generate")," and then serving already existing files by ",(0,r.kt)("inlineCode",{parentName:"p"},"re_data overview serve"),". For more details on paramters accepted by this & other re_data commands check ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/reference/cli/overview"},"re_data CLI reference"))),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"re_data overview generate\nre_data overview serve\n")),(0,r.kt)("h2",{id:"learning-more"},"Learning more"),(0,r.kt)("p",null,"More detailed instrutions on running re_data are described in out toy_shop ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("a",{parentName:"strong",href:"/docs/re_data/getting_started/toy_shop/toy_shop_data"},"example tutorial \ud83d\ude0a"))," "),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("h3",{parentName:"admonition",id:"got-stuck-anywhere"},"Got stuck anywhere?"),(0,r.kt)("p",{parentName:"admonition"},"If you have more questions, got stuck anywhere, or something is not working as expected, please let us know on ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a")),", we will help you asap, and it will help us improve this quick start guide.")))}u.isMDXComponent=!0}}]);