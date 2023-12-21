"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[8490],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>h});var n=r(7294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function a(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):a(a({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},d="mdxType",f={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},p=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,i=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(r),p=o,h=d["".concat(l,".").concat(p)]||d[p]||f[p]||i;return r?n.createElement(h,a(a({ref:t},u),{},{components:r})):n.createElement(h,a({ref:t},u))}));function h(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var i=r.length,a=new Array(i);a[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:o,a[1]=s;for(var c=2;c<i;c++)a[c]=r[c];return n.createElement.apply(null,a)}return n.createElement.apply(null,r)}p.displayName="MDXCreateElement"},4101:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>a,default:()=>d,frontMatter:()=>i,metadata:()=>s,toc:()=>c});var n=r(7462),o=(r(7294),r(3905));const i={},a="Redshift",s={unversionedId:"re_cloud/integrations/redshift",id:"re_cloud/integrations/redshift",title:"Redshift",description:"Overview",source:"@site/docs/re_cloud/integrations/redshift.md",sourceDirName:"re_cloud/integrations",slug:"/re_cloud/integrations/redshift",permalink:"/fixes-font/docs/re_cloud/integrations/redshift",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_cloud/integrations/redshift.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"re_data",permalink:"/fixes-font/docs/re_cloud/integrations/re_data"},next:{title:"Snowflake",permalink:"/fixes-font/docs/re_cloud/integrations/snowflake"}},l={},c=[{value:"Overview",id:"overview",level:2},{value:"Next steps",id:"next-steps",level:2},{value:"Redshift specific monitoring",id:"redshift-specific-monitoring",level:2}],u={toc:c};function d(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"redshift"},"Redshift"),(0,o.kt)("h2",{id:"overview"},"Overview"),(0,o.kt)("p",null,"re_cloud can you you track anomalies, schema changes and failed data tests in your Redshift tables.\nAll of this can be done through re_data library which supports Redshift."),(0,o.kt)("p",null,"You can check on how monitoring re_data information looks on Redshift ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"https://docs.getre.io/ui-latest-redshift/#/alerts"},"here"))),(0,o.kt)("h2",{id:"next-steps"},"Next steps"),(0,o.kt)("p",null,"Best way to start using re_data is to check out our quicksart tutorials. Either for users using dbt or the ones who are just using data warehouse:"),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},(0,o.kt)("a",{parentName:"strong",href:"/docs/re_data/getting_started/installation/for_dbt_users"},"Quickstart - dbt users"))),(0,o.kt)("li",{parentName:"ul"},(0,o.kt)("strong",{parentName:"li"},(0,o.kt)("a",{parentName:"strong",href:"/docs/re_data/getting_started/installation/new_to_dbt"},"Quickstart - new to dbt")))),(0,o.kt)("h2",{id:"redshift-specific-monitoring"},"Redshift specific monitoring"),(0,o.kt)("p",null,"If you have things you would like to monitor specifically for Redshift let us know on ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a")),". We are looking into adding more feaures for Redshift in the future."))}d.isMDXComponent=!0}}]);