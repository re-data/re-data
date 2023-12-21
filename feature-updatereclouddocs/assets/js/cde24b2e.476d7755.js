"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3924],{3905:(e,t,r)=>{r.d(t,{Zo:()=>d,kt:()=>y});var o=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function n(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?n(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):n(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,o,a=function(e,t){if(null==e)return{};var r,o,a={},n=Object.keys(e);for(o=0;o<n.length;o++)r=n[o],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(o=0;o<n.length;o++)r=n[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=o.createContext({}),c=function(e){var t=o.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},d=function(e){var t=c(e.components);return o.createElement(u.Provider,{value:t},e.children)},s="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},m=o.forwardRef((function(e,t){var r=e.components,a=e.mdxType,n=e.originalType,u=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),s=c(r),m=a,y=s["".concat(u,".").concat(m)]||s[m]||p[m]||n;return r?o.createElement(y,i(i({ref:t},d),{},{components:r})):o.createElement(y,i({ref:t},d))}));function y(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var n=r.length,i=new Array(n);i[0]=m;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[s]="string"==typeof e?e:a,i[1]=l;for(var c=2;c<n;c++)i[c]=r[c];return o.createElement.apply(null,i)}return o.createElement.apply(null,r)}m.displayName="MDXCreateElement"},4340:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>p,frontMatter:()=>n,metadata:()=>l,toc:()=>c});var o=r(7462),a=(r(7294),r(3905));const n={sidebar_position:2},i="Quickstart",l={unversionedId:"re_cloud/quickstart",id:"re_cloud/quickstart",title:"Quickstart",description:"In this quick tutorial we will deploy the UI of redata & dbtdocs to production environment when you and your team can check those 2 usefull reports. This introduction assumes you are using dbt and optionally also use re_data",source:"@site/docs/re_cloud/quickstart.md",sourceDirName:"re_cloud",slug:"/re_cloud/quickstart",permalink:"/feature-updatereclouddocs/docs/re_cloud/quickstart",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_cloud/quickstart.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"What is re_cloud?",permalink:"/feature-updatereclouddocs/docs/re_cloud/whatis_cloud"},next:{title:"dbt docs",permalink:"/feature-updatereclouddocs/docs/re_cloud/integrations/dbt_docs"}},u={},c=[{value:"Install re_cloud package",id:"install-re_cloud-package",level:2},{value:"Configure your API key",id:"configure-your-api-key",level:2},{value:"Generate reports",id:"generate-reports",level:2},{value:"Upload reports! \ud83d\ude0a",id:"upload-reports-",level:2},{value:"View them in the cloud",id:"view-them-in-the-cloud",level:2}],d={toc:c},s="wrapper";function p(e){let{components:t,...n}=e;return(0,a.kt)(s,(0,o.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"quickstart"},"Quickstart"),(0,a.kt)("p",null,"In this quick tutorial we will deploy the UI of re_data & dbt_docs to production environment when you and your team can check those 2 usefull reports. This introduction assumes you are using dbt and optionally also use re_data"),(0,a.kt)("h2",{id:"install-re_cloud-package"},"Install re_cloud package"),(0,a.kt)("p",null,"To upload reports you will need to install ",(0,a.kt)("inlineCode",{parentName:"p"},"re_cloud")," python package, you can easily to it with pip"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"pip install re_cloud\n")),(0,a.kt)("h2",{id:"configure-your-api-key"},"Configure your API key"),(0,a.kt)("p",null,"In the ",(0,a.kt)("inlineCode",{parentName:"p"},"Account Settings")," section of the re_cloud, you can find your API key, which will be used for uploading data."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"DashboardExample",src:r(1020).Z,width:"2880",height:"948"})),(0,a.kt)("p",null,"Then paste this into your ",(0,a.kt)("inlineCode",{parentName:"p"},"~/.re_data/re_data.yml")," configuration file. (For simplicity we use the same directory and file as you would use for ",(0,a.kt)("em",{parentName:"p"},"re_data")," package configuration)"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml",metastring:'title="~/.re_data/re_data.yml"',title:'"~/.re_data/re_data.yml"'},"\nre_cloud:\n  api_key: YOUR_KEY_HERE\n")),(0,a.kt)("h2",{id:"generate-reports"},"Generate reports"),(0,a.kt)("p",null,"If you didn't yet generated dbt docs and re_data reports you can do it now. ",(0,a.kt)("inlineCode",{parentName:"p"},"cd")," to your dbt project catalog and run:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"dbt docs generate\nre_data overview generate\n")),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"This commands require you to have dbt & re_data configured for the project. In case you just use dbt docs not re_data you can skip the second command. If you don't use any of it, check our instructions other tools we support.")),(0,a.kt)("h2",{id:"upload-reports-"},"Upload reports! \ud83d\ude0a"),(0,a.kt)("p",null,"Now with just 2 commands we can upload our reports to cloud"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"re_cloud upload dbt-docs\nre_cloud upload re-data\n")),(0,a.kt)("h2",{id:"view-them-in-the-cloud"},"View them in the cloud"),(0,a.kt)("p",null,"Now you cloud account should contain 2 additional reports with recent upload times."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"DashboardExample",src:r(1359).Z,width:"1898",height:"992"})),(0,a.kt)("p",null,"re_cloud supports uploading a couple of different reports, let's check all of them \ud83d\ude0a"))}p.isMDXComponent=!0},1020:(e,t,r)=>{r.d(t,{Z:()=>o});const o=r.p+"assets/images/getapikey-b04b2be087fa1aed84360a19d67b4be4.png"},1359:(e,t,r)=>{r.d(t,{Z:()=>o});const o=r.p+"assets/images/start_dashboard-e9ac36568d4525da6eb5ac06507f0939.png"}}]);