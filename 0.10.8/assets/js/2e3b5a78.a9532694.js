"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5520],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>m});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},i=Object.keys(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(a=0;a<i.length;a++)r=i[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var c=a.createContext({}),d=function(e){var t=a.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=d(e.components);return a.createElement(c.Provider,{value:t},e.children)},u="mdxType",s={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},f=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),u=d(r),f=n,m=u["".concat(c,".").concat(f)]||u[f]||s[f]||i;return r?a.createElement(m,o(o({ref:t},p),{},{components:r})):a.createElement(m,o({ref:t},p))}));function m(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,o=new Array(i);o[0]=f;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l[u]="string"==typeof e?e:n,o[1]=l;for(var d=2;d<i;d++)o[d]=r[d];return a.createElement.apply(null,o)}return a.createElement.apply(null,r)}f.displayName="MDXCreateElement"},788:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>s,frontMatter:()=>i,metadata:()=>l,toc:()=>d});var a=r(7462),n=(r(7294),r(3905));const i={sidebar_position:2},o="Run",l={unversionedId:"re_data/reference/cli/run",id:"re_data/reference/cli/run",title:"Run",description:"redata run CLI command is a helper command for computing & backfilling redata reliability data.",source:"@site/docs/re_data/reference/cli/run.md",sourceDirName:"re_data/reference/cli",slug:"/re_data/reference/cli/run",permalink:"/0.10.8/docs/re_data/reference/cli/run",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/reference/cli/run.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Overview",permalink:"/0.10.8/docs/re_data/reference/cli/overview"},next:{title:"Notify",permalink:"/0.10.8/docs/re_data/reference/cli/notify"}},c={},d=[{value:"run",id:"run-1",level:3}],p={toc:d},u="wrapper";function s(e){let{components:t,...r}=e;return(0,n.kt)(u,(0,a.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"run"},"Run"),(0,n.kt)("p",null,(0,n.kt)("inlineCode",{parentName:"p"},"re_data run")," CLI command is a helper command for computing & backfilling re_data reliability data."),(0,n.kt)("h3",{id:"run-1"},"run"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"re_data run --start-date 2021-01-01 --end-date 2021-01-30 --interval days:1\n")),(0,n.kt)("p",null,"Running this command will create/fill re_data specific models with reliability data."),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},"Supported argments:",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"start-date (",(0,n.kt)("em",{parentName:"li"},"default: today - 7 days"),") - start date of period for which you generate data"),(0,n.kt)("li",{parentName:"ul"},"end-date (",(0,n.kt)("em",{parentName:"li"},"default: today"),") - end date of period for which you generate data"),(0,n.kt)("li",{parentName:"ul"},"full-refresh - If specified re_data runs first dbt run with --full-refresh option cleaning all previously gathered profiling information."),(0,n.kt)("li",{parentName:"ul"},"interval (",(0,n.kt)("em",{parentName:"li"},"default: days:1"),") - basic time grain for the overview, supported values - ",(0,n.kt)("em",{parentName:"li"},"days"),", ",(0,n.kt)("em",{parentName:"li"},"hours"),", example: ",(0,n.kt)("strong",{parentName:"li"},"days:7"),", ",(0,n.kt)("strong",{parentName:"li"},"hours:1"),"."),(0,n.kt)("li",{parentName:"ul"},"re-data-target-dir - directory store alerts generated by re_data. Defaults to the 'target-path' used in dbt_project.yml."),(0,n.kt)("li",{parentName:"ul"},"dbt-vars - This accepts a valid YAML dictionary as string which is passed down to the dbt command using ",(0,n.kt)("a",{parentName:"li",href:"https://docs.getdbt.com/docs/building-a-dbt-project/building-models/using-variables"},"--vars"),"."))),(0,n.kt)("li",{parentName:"ul"},"Dbt supported arguments:",(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"profile - Which profile to load. Overrides setting in dbt_project.yml."),(0,n.kt)("li",{parentName:"ul"},"target - Which target to load for the given profile."),(0,n.kt)("li",{parentName:"ul"},"project-dir - Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents."),(0,n.kt)("li",{parentName:"ul"},"profiles-dir - Which directory to look in for the profiles.yml file. Default = ~/.dbt.")))))}s.isMDXComponent=!0}}]);