"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[487],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return f}});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),u=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),p=u(r),f=n,m=p["".concat(s,".").concat(f)]||p[f]||d[f]||o;return r?a.createElement(m,i(i({ref:t},c),{},{components:r})):a.createElement(m,i({ref:t},c))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=p;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:n,i[1]=l;for(var u=2;u<o;u++)i[u]=r[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}p.displayName="MDXCreateElement"},1444:function(e,t,r){r.r(t),r.d(t,{assets:function(){return c},contentTitle:function(){return s},default:function(){return f},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return d}});var a=r(7462),n=r(3366),o=(r(7294),r(3905)),i=["components"],l={sidebar_position:0},s="Welcome to our docs!",u={unversionedId:"start_here",id:"start_here",title:"Welcome to our docs!",description:"At redata we are helping data teams (and theirs users!) to keep data reliable. We believe open-source is quite often the right answer for data tools and that's why we wrote redata dbt native library for data reliability, in line with that we also run re_cloud which helps collobarate on data issues found in a different open-source tools.",source:"@site/docs/start_here.md",sourceDirName:".",slug:"/start_here",permalink:"/347-feature-skip-nulls-in-charts-instead-of-treating-them-as-0s/docs/start_here",editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/start_here.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{sidebar_position:0},sidebar:"tutorialSidebar",next:{title:"What is re_data?",permalink:"/347-feature-skip-nulls-in-charts-instead-of-treating-them-as-0s/docs/re_data/introduction/whatis_data"}},c={},d=[{value:"re_data",id:"re_data",level:2},{value:"re_cloud",id:"re_cloud",level:2}],p={toc:d};function f(e){var t=e.components,l=(0,n.Z)(e,i);return(0,o.kt)("wrapper",(0,a.Z)({},p,l,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"welcome-to-our-docs"},"Welcome to our docs!"),(0,o.kt)("p",null,"At re_data we are helping data teams (and theirs users!) to keep data reliable. We believe open-source is quite often the right answer for data tools and that's why we wrote ",(0,o.kt)("inlineCode",{parentName:"p"},"re_data")," dbt native library for data reliability, in line with that we also run ",(0,o.kt)("inlineCode",{parentName:"p"},"re_cloud")," which helps collobarate on data issues found in a different open-source tools."),(0,o.kt)("h2",{id:"re_data"},"re_data"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"re_data")," is an open-source data reliability framework build for modern data stack."),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"re_data")," focuses on observing the dbt project and lets you:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"get alerts about bad data"),(0,o.kt)("li",{parentName:"ul"},"compute data quality metrics"),(0,o.kt)("li",{parentName:"ul"},"write your own data asserts"),(0,o.kt)("li",{parentName:"ul"},"and more \ud83d\ude0a")),(0,o.kt)("p",null,"To start with ",(0,o.kt)("strong",{parentName:"p"},"re_data")," go to ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"/docs/re_data/introduction/whatis_data"},"introduction"))," \ud83d\ude80"),(0,o.kt)("p",null,"Check out our ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"https://re-data.github.io/re-data/ui-latest/#/alerts"},"live demo"))," of what re_data can do for you! \ud83d\ude0a"),(0,o.kt)("p",null,(0,o.kt)("img",{loading:"lazy",alt:"GraphExample",src:r(1319).Z,width:"1587",height:"863"})),(0,o.kt)("h2",{id:"re_cloud"},"re_cloud"),(0,o.kt)("p",null,(0,o.kt)("strong",{parentName:"p"},"re_cloud")," allows you to very easily host and collaborate on data reports from different data tools. Some we are currently supporting are: "),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"re_data \ud83d\ude0a"),(0,o.kt)("li",{parentName:"ul"},"dbt docs"),(0,o.kt)("li",{parentName:"ul"},"great_expectations"),(0,o.kt)("li",{parentName:"ul"},"pandas_profiling"),(0,o.kt)("li",{parentName:"ul"},"jupyter notebooks"),(0,o.kt)("li",{parentName:"ul"},"custom reports")),(0,o.kt)("p",null,"We think of ",(0,o.kt)("inlineCode",{parentName:"p"},"re_cloud")," as a control center for you data. We wrote a simple ",(0,o.kt)("inlineCode",{parentName:"p"},"re_cloud")," library (available as a python library) to upload supported reports to the cloud."),(0,o.kt)("p",null,"To start with a cloud you can create ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"https://cloud.getre.io/#/register"},"a free account here \ud83d\ude0a")),"\nor check our ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"/docs/re_cloud/Introduction/whatis_cloud"},"introdudction docs"))," for more information on it."),(0,o.kt)("p",null,(0,o.kt)("img",{loading:"lazy",alt:"DashboardExample",src:r(1969).Z,width:"1638",height:"1072"})))}f.isMDXComponent=!0},1969:function(e,t,r){t.Z=r.p+"assets/images/dashboard-a5e9e193485fda14dc24915f1ca9ed3d.png"},1319:function(e,t,r){t.Z=r.p+"assets/images/graph-9b350274adfb40bc5c806d7ae9d54c49.png"}}]);