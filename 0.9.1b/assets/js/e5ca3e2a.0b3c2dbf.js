"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[799],{3905:function(e,t,r){r.d(t,{Zo:function(){return p},kt:function(){return f}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),u=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=u(e.components);return n.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},s=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),s=u(r),f=a,m=s["".concat(c,".").concat(f)]||s[f]||d[f]||i;return r?n.createElement(m,o(o({ref:t},p),{},{components:r})):n.createElement(m,o({ref:t},p))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=s;var l={};for(var c in t)hasOwnProperty.call(t,c)&&(l[c]=t[c]);l.originalType=e,l.mdxType="string"==typeof e?e:a,o[1]=l;for(var u=2;u<i;u++)o[u]=r[u];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}s.displayName="MDXCreateElement"},198:function(e,t,r){r.r(t),r.d(t,{assets:function(){return p},contentTitle:function(){return c},default:function(){return f},frontMatter:function(){return l},metadata:function(){return u},toc:function(){return d}});var n=r(7462),a=r(3366),i=(r(7294),r(3905)),o=["components"],l={sidebar_position:2},c="Run",u={unversionedId:"reference/cli/run",id:"reference/cli/run",title:"Run",description:"redata run CLI command is a helper command for computing & backfilling redata reliability data.",source:"@site/docs/reference/cli/run.md",sourceDirName:"reference/cli",slug:"/reference/cli/run",permalink:"/0.9.1b/docs/reference/cli/run",editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/reference/cli/run.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Overview",permalink:"/0.9.1b/docs/reference/cli/overview"},next:{title:"Notify",permalink:"/0.9.1b/docs/reference/cli/notify"}},p={},d=[{value:"run",id:"run-1",level:3}],s={toc:d};function f(e){var t=e.components,r=(0,a.Z)(e,o);return(0,i.kt)("wrapper",(0,n.Z)({},s,r,{components:t,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"run"},"Run"),(0,i.kt)("p",null,(0,i.kt)("inlineCode",{parentName:"p"},"re_data run")," CLI command is a helper command for computing & backfilling re_data reliability data."),(0,i.kt)("h3",{id:"run-1"},"run"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre"},"re_data run --start-date 2021-01-01 --end-date 2021-01-30 --interval days:1\n")),(0,i.kt)("p",null,"Running this command will create/fill re_data specific models with reliability data."),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"Supported argments:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"start-date (",(0,i.kt)("em",{parentName:"li"},"default: today - 7 days"),") - start date of period for which you generate data"),(0,i.kt)("li",{parentName:"ul"},"end-date (",(0,i.kt)("em",{parentName:"li"},"default: today"),") - end date of period for which you generate data"),(0,i.kt)("li",{parentName:"ul"},"full-refresh - If specified re_data runs first dbt run with --full-refresh option cleaning all previously gathered profiling information."),(0,i.kt)("li",{parentName:"ul"},"interval (",(0,i.kt)("em",{parentName:"li"},"default: days:1"),") - basic time grain for the overview, supported values - ",(0,i.kt)("em",{parentName:"li"},"days"),", ",(0,i.kt)("em",{parentName:"li"},"hours"),", example: ",(0,i.kt)("strong",{parentName:"li"},"days:7"),", ",(0,i.kt)("strong",{parentName:"li"},"hours:1"),"."),(0,i.kt)("li",{parentName:"ul"},"re-data-target-dir - directory store alerts generated by re_data. Defaults to the 'target-path' used in dbt_project.yml."),(0,i.kt)("li",{parentName:"ul"},"dbt-vars - This accepts a valid YAML dictionary as string which is passed down to the dbt command using ",(0,i.kt)("a",{parentName:"li",href:"https://docs.getdbt.com/docs/building-a-dbt-project/building-models/using-variables"},"--vars"),"."))),(0,i.kt)("li",{parentName:"ul"},"Dbt supported arguments:",(0,i.kt)("ul",{parentName:"li"},(0,i.kt)("li",{parentName:"ul"},"profile - Which profile to load. Overrides setting in dbt_project.yml."),(0,i.kt)("li",{parentName:"ul"},"target - Which target to load for the given profile."),(0,i.kt)("li",{parentName:"ul"},"project-dir - Which directory to look in for the dbt_project.yml file. Default is the current working directory and its parents."),(0,i.kt)("li",{parentName:"ul"},"profiles-dir - Which directory to look in for the profiles.yml file. Default = ~/.dbt.")))))}f.isMDXComponent=!0}}]);