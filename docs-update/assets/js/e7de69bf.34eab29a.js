"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1882],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function d(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var l=a.createContext({}),c=function(e){var t=a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},s="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},f=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,l=e.parentName,p=d(e,["components","mdxType","originalType","parentName"]),s=c(r),f=n,m=s["".concat(l,".").concat(f)]||s[f]||u[f]||o;return r?a.createElement(m,i(i({ref:t},p),{},{components:r})):a.createElement(m,i({ref:t},p))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=f;var d={};for(var l in t)hasOwnProperty.call(t,l)&&(d[l]=t[l]);d.originalType=e,d[s]="string"==typeof e?e:n,i[1]=d;for(var c=2;c<o;c++)i[c]=r[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}f.displayName="MDXCreateElement"},5117:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>d,toc:()=>c});var a=r(7462),n=(r(7294),r(3905));const o={sidebar_position:2},i="re_data",d={unversionedId:"re_cloud/integrations/re_data",id:"re_cloud/integrations/re_data",title:"re_data",description:"Overview",source:"@site/docs/re_cloud/integrations/re_data.md",sourceDirName:"re_cloud/integrations",slug:"/re_cloud/integrations/re_data",permalink:"/docs-update/docs/re_cloud/integrations/re_data",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_cloud/integrations/re_data.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"dbt docs",permalink:"/docs-update/docs/re_cloud/integrations/dbt_docs"},next:{title:"great-expectations",permalink:"/docs-update/docs/re_cloud/integrations/great_expectations"}},l={},c=[{value:"Overview",id:"overview",level:2},{value:"Uploading to re_cloud",id:"uploading-to-re_cloud",level:2},{value:"Next steps",id:"next-steps",level:2}],p={toc:c},s="wrapper";function u(e){let{components:t,...o}=e;return(0,n.kt)(s,(0,a.Z)({},p,o,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"re_data"},"re_data"),(0,n.kt)("h2",{id:"overview"},"Overview"),(0,n.kt)("p",null,"re_data let's you track data in your dbt project. Check out our docs for more detailed overview of re_data ",(0,n.kt)("strong",{parentName:"p"},(0,n.kt)("a",{parentName:"strong",href:"/docs/re_data/introduction/whatis_data"},"here"))),(0,n.kt)("p",null,"One of the main features of re_data is ability to product overview of your data. It's a great way to share information about your data with other people in the company."),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"re_data_example",src:r(3447).Z,width:"2876",height:"1578"})),(0,n.kt)("h2",{id:"uploading-to-re_cloud"},"Uploading to re_cloud"),(0,n.kt)("p",null,"to send re_data to re_cloud, first generate re_data overview and then upload it to re_cloud with a single command."),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"re_data overview generate\nre_cloud upload re-data\n")),(0,n.kt)("p",null,"Below we show all the currently supported options on how you can upload re-data to ",(0,n.kt)("inlineCode",{parentName:"p"},"re_cloud")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"re_cloud upload re-data --name TEXT --project-dir TEXT --re-data-target-dir TEXT\n\nOptions:\n  --project-dir TEXT         Which directory to look in for the\n                             dbt_project.yml file. Default is the current\n                             working directory and its parents\n\n  --re-data-target-dir TEXT  Which directory to store artefacts generated by\n                             re_data Defaults to the 'target-path' used in\n                             dbt_project.yml\n\n  --name TEXT                Name of the upload used for identification\n")),(0,n.kt)("p",null,"If you are inside dbt project dir and didn't changed default ",(0,n.kt)("inlineCode",{parentName:"p"},"target")," directory for docs and re_data both ",(0,n.kt)("inlineCode",{parentName:"p"},"project-dir")," and ",(0,n.kt)("inlineCode",{parentName:"p"},"re-data-target-dir")," are optional."),(0,n.kt)("h2",{id:"next-steps"},"Next steps"),(0,n.kt)("p",null,"If you would like to jump into uploading data you can create your ",(0,n.kt)("strong",{parentName:"p"},(0,n.kt)("a",{parentName:"strong",href:"https://cloud.getre.io/#/register"},"free account here \ud83d\ude0a"))," if you have more questions for us: don't be reluctant to join our ",(0,n.kt)("strong",{parentName:"p"},(0,n.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a"))))}u.isMDXComponent=!0},3447:(e,t,r)=>{r.d(t,{Z:()=>a});const a=r.p+"assets/images/re_data-b5233788e0ddf1513afab46737acf8da.png"}}]);