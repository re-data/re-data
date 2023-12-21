"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9632],{3905:(e,t,a)=>{a.d(t,{Zo:()=>d,kt:()=>h});var o=a(7294);function n(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,o)}return a}function s(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){n(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function l(e,t){if(null==e)return{};var a,o,n=function(e,t){if(null==e)return{};var a,o,n={},r=Object.keys(e);for(o=0;o<r.length;o++)a=r[o],t.indexOf(a)>=0||(n[a]=e[a]);return n}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(o=0;o<r.length;o++)a=r[o],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(n[a]=e[a])}return n}var i=o.createContext({}),p=function(e){var t=o.useContext(i),a=t;return e&&(a="function"==typeof e?e(t):s(s({},t),e)),a},d=function(e){var t=p(e.components);return o.createElement(i.Provider,{value:t},e.children)},u="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var a=e.components,n=e.mdxType,r=e.originalType,i=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),u=p(a),m=n,h=u["".concat(i,".").concat(m)]||u[m]||c[m]||r;return a?o.createElement(h,s(s({ref:t},d),{},{components:a})):o.createElement(h,s({ref:t},d))}));function h(e,t){var a=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var r=a.length,s=new Array(r);s[0]=m;var l={};for(var i in t)hasOwnProperty.call(t,i)&&(l[i]=t[i]);l.originalType=e,l[u]="string"==typeof e?e:n,s[1]=l;for(var p=2;p<r;p++)s[p]=a[p];return o.createElement.apply(null,s)}return o.createElement.apply(null,a)}m.displayName="MDXCreateElement"},5162:(e,t,a)=>{a.d(t,{Z:()=>s});var o=a(7294),n=a(6010);const r="tabItem_Ymn6";function s(e){let{children:t,hidden:a,className:s}=e;return o.createElement("div",{role:"tabpanel",className:(0,n.Z)(r,s),hidden:a},t)}},5488:(e,t,a)=>{a.d(t,{Z:()=>m});var o=a(7462),n=a(7294),r=a(6010),s=a(2389),l=a(7392),i=a(7094),p=a(2466);const d="tabList__CuJ",u="tabItem_LNqP";function c(e){const{lazy:t,block:a,defaultValue:s,values:c,groupId:m,className:h}=e,y=n.Children.map(e.children,(e=>{if((0,n.isValidElement)(e)&&"value"in e.props)return e;throw new Error(`Docusaurus error: Bad <Tabs> child <${"string"==typeof e.type?e.type:e.type.name}>: all children of the <Tabs> component should be <TabItem>, and every <TabItem> should have a unique "value" prop.`)})),g=c??y.map((e=>{let{props:{value:t,label:a,attributes:o}}=e;return{value:t,label:a,attributes:o}})),f=(0,l.l)(g,((e,t)=>e.value===t.value));if(f.length>0)throw new Error(`Docusaurus error: Duplicate values "${f.map((e=>e.value)).join(", ")}" found in <Tabs>. Every value needs to be unique.`);const b=null===s?s:s??y.find((e=>e.props.default))?.props.value??y[0].props.value;if(null!==b&&!g.some((e=>e.value===b)))throw new Error(`Docusaurus error: The <Tabs> has a defaultValue "${b}" but none of its children has the corresponding value. Available values are: ${g.map((e=>e.value)).join(", ")}. If you intend to show no default tab, use defaultValue={null} instead.`);const{tabGroupChoices:_,setTabGroupChoices:k}=(0,i.U)(),[v,N]=(0,n.useState)(b),w=[],{blockElementScrollPositionUntilNextRender:x}=(0,p.o5)();if(null!=m){const e=_[m];null!=e&&e!==v&&g.some((t=>t.value===e))&&N(e)}const E=e=>{const t=e.currentTarget,a=w.indexOf(t),o=g[a].value;o!==v&&(x(t),N(o),null!=m&&k(m,String(o)))},T=e=>{let t=null;switch(e.key){case"Enter":E(e);break;case"ArrowRight":{const a=w.indexOf(e.currentTarget)+1;t=w[a]??w[0];break}case"ArrowLeft":{const a=w.indexOf(e.currentTarget)-1;t=w[a]??w[w.length-1];break}}t?.focus()};return n.createElement("div",{className:(0,r.Z)("tabs-container",d)},n.createElement("ul",{role:"tablist","aria-orientation":"horizontal",className:(0,r.Z)("tabs",{"tabs--block":a},h)},g.map((e=>{let{value:t,label:a,attributes:s}=e;return n.createElement("li",(0,o.Z)({role:"tab",tabIndex:v===t?0:-1,"aria-selected":v===t,key:t,ref:e=>w.push(e),onKeyDown:T,onClick:E},s,{className:(0,r.Z)("tabs__item",u,s?.className,{"tabs__item--active":v===t})}),a??t)}))),t?(0,n.cloneElement)(y.filter((e=>e.props.value===v))[0],{className:"margin-top--md"}):n.createElement("div",{className:"margin-top--md"},y.map(((e,t)=>(0,n.cloneElement)(e,{key:t,hidden:e.props.value!==v})))))}function m(e){const t=(0,s.Z)();return n.createElement(c,(0,o.Z)({key:String(t)},e))}},8153:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>d,contentTitle:()=>i,default:()=>m,frontMatter:()=>l,metadata:()=>p,toc:()=>u});var o=a(7462),n=(a(7294),a(3905)),r=a(5488),s=a(5162);const l={sidebar_position:1},i="Welcome to toy shop!",p={unversionedId:"re_data/getting_started/toy_shop/toy_shop_data",id:"re_data/getting_started/toy_shop/toy_shop_data",title:"Welcome to toy shop!",description:"Welcome to a re_data getting started tutorial. We will prepare, analyze and monitor toy shop data here. The toy shop is a fictional e-commerce shop \ud83d\ude42",source:"@site/docs/re_data/getting_started/toy_shop/toy_shop_data.mdx",sourceDirName:"re_data/getting_started/toy_shop",slug:"/re_data/getting_started/toy_shop/toy_shop_data",permalink:"/fixes-settingsfix/docs/re_data/getting_started/toy_shop/toy_shop_data",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/getting_started/toy_shop/toy_shop_data.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Quickstart - new to dbt",permalink:"/fixes-settingsfix/docs/re_data/getting_started/installation/new_to_dbt"},next:{title:"Reliability data",permalink:"/fixes-settingsfix/docs/re_data/getting_started/toy_shop/compute_monitoring"}},d={},u=[{value:"Setting up toy shop project",id:"setting-up-toy-shop-project",level:2},{value:"Toy shop data",id:"toy-shop-data",level:2},{value:"Profile setup",id:"profile-setup",level:2},{value:"Loading data &amp; creating models",id:"loading-data--creating-models",level:2}],c={toc:u};function m(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,o.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"welcome-to-toy-shop"},"Welcome to toy shop!"),(0,n.kt)("p",null,"Welcome to a re_data getting started tutorial. We will prepare, analyze and monitor toy shop data here. The toy shop is a fictional e-commerce shop \ud83d\ude42"),(0,n.kt)("p",null,"It's an example of how a re_data project can work and help you improve data in your data warehouse"),(0,n.kt)("h2",{id:"setting-up-toy-shop-project"},"Setting up toy shop project"),(0,n.kt)("p",null,"Install re_data if you don't have it already"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-bash"},"pip install re_data\n")),(0,n.kt)("p",null,"Set up a dbt project containing the toy shop data using the re_data CLI."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-bash"},"re_data init toy_shop\ncd toy_shop/\n")),(0,n.kt)("h2",{id:"toy-shop-data"},"Toy shop data"),(0,n.kt)("p",null,"You would observe that the project has two seed files included:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"toy_shop/seeds/customers.csv"),(0,n.kt)("li",{parentName:"ul"},"toy_shop/seeds/orders.csv")),(0,n.kt)("p",null,"And it also contains one model:"),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"toy_shop/models/pending_orders_per_customer.sql")),(0,n.kt)("admonition",{type:"info"},(0,n.kt)("p",{parentName:"admonition"},"Both seeds & model are already configured to be monitored by re_data, we will describe this configuration later on during the tutorial")),(0,n.kt)("admonition",{type:"info"},(0,n.kt)("p",{parentName:"admonition"},"We use seeds instead of sources much more often than you would normally do in dbt. This is due to the convenient setup dbt offers for seeds")),(0,n.kt)("h2",{id:"profile-setup"},"Profile setup"),(0,n.kt)("p",null,"For re_data to work you will need dbt connection with the name ",(0,n.kt)("inlineCode",{parentName:"p"},"toy_shop")," (project name we used) Here are examples of how it could look like in dbs supported by re_data, you can also check more details on connection configuration in  ",(0,n.kt)("strong",{parentName:"p"},(0,n.kt)("a",{parentName:"strong",href:"https://docs.getdbt.com/reference/profiles.yml"},"dbt profiles docs")),"."),(0,n.kt)(r.Z,{defaultValue:"bigquery",values:[{label:"BigQuery",value:"bigquery"},{label:"Snowflake",value:"snowflake"},{label:"Redshift",value:"redshift"},{label:"Postgres",value:"postgres"}],mdxType:"Tabs"},(0,n.kt)(s.Z,{value:"snowflake",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-yml",metastring:"title=~/.dbt/profiles.yml",title:"~/.dbt/profiles.yml"},"toy_shop:\n  target: dev\n  outputs:\n    dev:\n      type: snowflake\n      account: xxx\n      user: xxx\n      password: xxx\n      database: database\n      warehouse: warehouse\n      schema: toy_shop\n"))),(0,n.kt)(s.Z,{value:"bigquery",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-yml",metastring:"title=~/.dbt/profiles.yml",title:"~/.dbt/profiles.yml"},"toy_shop:\n  target: dev\n  outputs:\n    dev:\n      type: bigquery\n      method: oauth\n      project: xxx\n      schema: toy_shop\n      location: US\n      threads: 4\n"))),(0,n.kt)(s.Z,{value:"redshift",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-yml",metastring:"title=~/.dbt/profiles.yml",title:"~/.dbt/profiles.yml"},"toy_shop:\n  target: dev\n  outputs:\n    dev:\n      type: redshift\n      host: xxx\n      user: xxx\n      password: xxx\n      port: 5439\n      dbname: xxx\n      schema: toy_shop\n      threads: 4\n"))),(0,n.kt)(s.Z,{value:"postgres",mdxType:"TabItem"},(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-yml",metastring:"title=~/.dbt/profiles.yml",title:"~/.dbt/profiles.yml"},"toy_shop:\n  target: dev\n  outputs:\n    dev:\n      type: postgres\n      host: xxx\n      user: xxx\n      password: xxx\n      port: 5432\n      dbname: xxx\n      schema: toy_shop\n      threads: 4\n")))),(0,n.kt)("h2",{id:"loading-data--creating-models"},"Loading data & creating models"),(0,n.kt)("p",null,"Now you are ready to load toy_shop seed data & create project models."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-yaml"},"# load seed files into the database\ndbt seed\n# Compute models for toy_shop project, only pending_orders_per_customer table in this case.\ndbt run --select package:toy_shop\n")),(0,n.kt)("p",null,"After this step 3 tables should be available in the data warehouse of your choice:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre",className:"language-sql",metastring:'title="Loaded data"',title:'"Loaded','data"':!0},"toy_shop=> SELECT * FROM toy_shop.orders;\n id  | customer_id |     status      | amount |    time_created\n-----+-------------+-----------------+--------+---------------------\n   1 |           2 | PAID            |  20000 | 2021-01-02 14:10:54\n   2 |           3 | SHIPPED         |  20000 | 2021-01-06 06:39:15\n   3 |           4 | DELIVERED       |  40000 | 2021-01-10 20:46:55\n   4 |           5 | PENDING_PAYMENT |  20000 | 2021-01-10 12:15:55\n   5 |           6 | PAID            |  25000 | 2021-01-09 21:38:54\n   ..\n   ..\n   ..\ntoy_shop=> SELECT * FROM toy_shop.customers;\n id | age |       name\n----+-----+-------------------\n  1 |  25 | Matias Douglas\n  2 |  38 | Raelyn Harrison\n  3 |  34 | Anaya Reed\n  4 |  46 | Mario Harris\n  5 |  28 | John Roberts\n  ..\n  ..\n  ..\ntoy_shop=> SELECT * FROM toy_shop.pending_orders_per_customer;\n id  | amount |     status      |    time_created     | customer_id | age\n-----+--------+-----------------+---------------------+-------------+-----\n   4 |  20000 | PENDING_PAYMENT | 2021-01-10 12:15:55 |           5 |  28\n   8 |   5000 | PENDING_PAYMENT | 2021-01-05 11:41:49 |           9 |  60\n  12 |  20000 | PENDING_PAYMENT | 2021-01-08 13:10:48 |          13 |  38\n  16 |  30000 | PENDING_PAYMENT | 2021-01-05 13:57:46 |           2 |  38\n  20 |  30000 | PENDING_PAYMENT | 2021-01-09 20:07:28 |           6 |  39\n  24 |  10000 | PENDING_PAYMENT | 2021-01-06 06:42:35 |          10 |  29\n  28 |  45000 | PENDING_PAYMENT | 2021-01-02 10:03:27 |          14 |  20\n  ..\n  ..\n  ..\n")),(0,n.kt)("admonition",{type:"info"},(0,n.kt)("h3",{parentName:"admonition",id:"more-questions"},"More questions?"),(0,n.kt)("p",{parentName:"admonition"},"If you have more questions, got stuck anywhere or something is not working as expected please let us know on ",(0,n.kt)("strong",{parentName:"p"},(0,n.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a")),", we will help you asap and it will help us improve this tutorial.")))}m.isMDXComponent=!0}}]);