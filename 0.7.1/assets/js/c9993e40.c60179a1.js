"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[994],{3905:function(t,e,a){a.d(e,{Zo:function(){return u},kt:function(){return m}});var r=a(7294);function n(t,e,a){return e in t?Object.defineProperty(t,e,{value:a,enumerable:!0,configurable:!0,writable:!0}):t[e]=a,t}function o(t,e){var a=Object.keys(t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(t);e&&(r=r.filter((function(e){return Object.getOwnPropertyDescriptor(t,e).enumerable}))),a.push.apply(a,r)}return a}function i(t){for(var e=1;e<arguments.length;e++){var a=null!=arguments[e]?arguments[e]:{};e%2?o(Object(a),!0).forEach((function(e){n(t,e,a[e])})):Object.getOwnPropertyDescriptors?Object.defineProperties(t,Object.getOwnPropertyDescriptors(a)):o(Object(a)).forEach((function(e){Object.defineProperty(t,e,Object.getOwnPropertyDescriptor(a,e))}))}return t}function s(t,e){if(null==t)return{};var a,r,n=function(t,e){if(null==t)return{};var a,r,n={},o=Object.keys(t);for(r=0;r<o.length;r++)a=o[r],e.indexOf(a)>=0||(n[a]=t[a]);return n}(t,e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(t);for(r=0;r<o.length;r++)a=o[r],e.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(t,a)&&(n[a]=t[a])}return n}var c=r.createContext({}),d=function(t){var e=r.useContext(c),a=e;return t&&(a="function"==typeof t?t(e):i(i({},e),t)),a},u=function(t){var e=d(t.components);return r.createElement(c.Provider,{value:e},t.children)},l={inlineCode:"code",wrapper:function(t){var e=t.children;return r.createElement(r.Fragment,{},e)}},p=r.forwardRef((function(t,e){var a=t.components,n=t.mdxType,o=t.originalType,c=t.parentName,u=s(t,["components","mdxType","originalType","parentName"]),p=d(a),m=n,h=p["".concat(c,".").concat(m)]||p[m]||l[m]||o;return a?r.createElement(h,i(i({ref:e},u),{},{components:a})):r.createElement(h,i({ref:e},u))}));function m(t,e){var a=arguments,n=e&&e.mdxType;if("string"==typeof t||n){var o=a.length,i=new Array(o);i[0]=p;var s={};for(var c in e)hasOwnProperty.call(e,c)&&(s[c]=e[c]);s.originalType=t,s.mdxType="string"==typeof t?t:n,i[1]=s;for(var d=2;d<o;d++)i[d]=a[d];return r.createElement.apply(null,i)}return r.createElement.apply(null,a)}p.displayName="MDXCreateElement"},9391:function(t,e,a){a.r(e),a.d(e,{assets:function(){return u},contentTitle:function(){return c},default:function(){return m},frontMatter:function(){return s},metadata:function(){return d},toc:function(){return l}});var r=a(7462),n=a(3366),o=(a(7294),a(3905)),i=["components"],s={sidebar_position:1},c="What is re_data?",d={unversionedId:"introduction/whatis",id:"introduction/whatis",title:"What is re_data?",description:"re_data is an open-source data reliability framework for modern data stack. \ud83d\ude0a",source:"@site/docs/introduction/whatis.md",sourceDirName:"introduction",slug:"/introduction/whatis",permalink:"/0.7.1/docs/introduction/whatis",editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/introduction/whatis.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",next:{title:"Integrations",permalink:"/0.7.1/docs/introduction/integrations"}},u={},l=[{value:"Alerts",id:"alerts",level:2},{value:"Metrics",id:"metrics",level:2},{value:"Tests",id:"tests",level:2},{value:"Lineage",id:"lineage",level:2},{value:"Macros",id:"macros",level:2},{value:"Notifications",id:"notifications",level:2}],p={toc:l};function m(t){var e=t.components,s=(0,n.Z)(t,i);return(0,o.kt)("wrapper",(0,r.Z)({},p,s,{components:e,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"what-is-re_data"},"What is re_data?"),(0,o.kt)("p",null,"re_data is an open-source data reliability framework for modern data stack. \ud83d\ude0a"),(0,o.kt)("p",null,"Currently, re_data focuses on observing the dbt project (together with underlying data warehouse - Postgres, BigQuery, Snowflake, Redshift)."),(0,o.kt)("h1",{id:"live-demo"},"Live demo"),(0,o.kt)("p",null,"Check out our ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"https://re-data.github.io/re-data/ui-latest/#/alerts"},"live demo"))," of what re_data can do for you! \ud83d\ude0a"),(0,o.kt)("p",null,(0,o.kt)("img",{loading:"lazy",alt:"GraphExample",src:a(1319).Z,width:"1587",height:"863"})),(0,o.kt)("h1",{id:"features"},"Features"),(0,o.kt)("h2",{id:"alerts"},"Alerts"),(0,o.kt)("p",null,"Get information about suspicious data patterns & schema changes automatically. re_data detects trends in your data and creates alerts if something seems suspicious."),(0,o.kt)("h2",{id:"metrics"},"Metrics"),(0,o.kt)("p",null,"Monitor predefined and custom metrics about your data. All metrics are stored in your database and accessible for you. re_data custom metrics can be standard dbt macros which make it very easy to add them to your project."),(0,o.kt)("h2",{id:"tests"},"Tests"),(0,o.kt)("p",null,"re_data stores dbt test history making it easier to inspect it.\nApart from that re_data ships with a set of generic dbt tests which can be used to assert that metrics computed are meeting your assumptions."),(0,o.kt)("h2",{id:"lineage"},"Lineage"),(0,o.kt)("p",null,"re_data shows data lineage for your data warehouse. (This is imported from the dbt graph). You can navigate your data & investigate alerts & metrics related to each node in the graph."),(0,o.kt)("h2",{id:"macros"},"Macros"),(0,o.kt)("p",null,"re_data ships with a set of macros to save you time and some pain of writing code for cleaning / normalizing / validating your data. Use them to make your project cleaner \ud83d\ude0a. You can also use them as a base for your own metrics or data tests."),(0,o.kt)("h2",{id:"notifications"},"Notifications"),(0,o.kt)("p",null,"re_data sends notifications about suspicious data patterns, schema changes to your Slack so you can react quickly and fix the issues."),(0,o.kt)("h1",{id:"getting-started"},"Getting started"),(0,o.kt)("p",null,"re_data is very easy to add to existing dbt projects. Check out ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"/docs/getting_started/installation/for_dbt_users"},"quickstart"))," instructions and follow ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"/docs/getting_started/toy_shop/toy_shop_data"},"toy shop"))," tutorial to see how you can generate re_data reliability data & UI for your data warehouse."),(0,o.kt)("p",null,"If you are not using dbt, re_data can still be a great option to start monitoring your existing tables. Check out installation for new users: ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"/docs/getting_started/installation/new_to_dbt"},"new to dbt"))," in this case."),(0,o.kt)("div",{className:"admonition admonition-info alert alert--info"},(0,o.kt)("div",{parentName:"div",className:"admonition-heading"},(0,o.kt)("h5",{parentName:"div"},(0,o.kt)("span",{parentName:"h5",className:"admonition-icon"},(0,o.kt)("svg",{parentName:"span",xmlns:"http://www.w3.org/2000/svg",width:"14",height:"16",viewBox:"0 0 14 16"},(0,o.kt)("path",{parentName:"svg",fillRule:"evenodd",d:"M7 2.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 8c0-3.14 2.56-5.7 5.7-5.7zM7 1C3.14 1 0 4.14 0 8s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7zm1 3H6v5h2V4zm0 6H6v2h2v-2z"}))),"info")),(0,o.kt)("div",{parentName:"div",className:"admonition-content"},(0,o.kt)("h3",{parentName:"div",id:"more-questions"},"More questions?"),(0,o.kt)("p",{parentName:"div"},"Ask as on ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a")),". We will help you asap and you will help us improve our documentation"))))}m.isMDXComponent=!0},1319:function(t,e,a){e.Z=a.p+"assets/images/graph-9b350274adfb40bc5c806d7ae9d54c49.png"}}]);