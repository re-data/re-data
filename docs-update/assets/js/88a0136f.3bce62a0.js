"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[1739],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>f});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function c(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},a=Object.keys(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)n=a[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var l=r.createContext({}),u=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=u(e.components);return r.createElement(l.Provider,{value:t},e.children)},d="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},m=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,s=c(e,["components","mdxType","originalType","parentName"]),d=u(n),m=o,f=d["".concat(l,".").concat(m)]||d[m]||p[m]||a;return n?r.createElement(f,i(i({ref:t},s),{},{components:n})):r.createElement(f,i({ref:t},s))}));function f(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=n.length,i=new Array(a);i[0]=m;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c[d]="string"==typeof e?e:o,i[1]=c;for(var u=2;u<a;u++)i[u]=n[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}m.displayName="MDXCreateElement"},4700:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>c,toc:()=>u});var r=n(7462),o=(n(7294),n(3905));const a={sidebar_position:0},i="Configuration",c={unversionedId:"re_cloud/reference/configuration",id:"re_cloud/reference/configuration",title:"Configuration",description:"re_cloud command line common arguments",source:"@site/docs/re_cloud/reference/configuration.md",sourceDirName:"re_cloud/reference",slug:"/re_cloud/reference/configuration",permalink:"/docs-update/docs/re_cloud/reference/configuration",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_cloud/reference/configuration.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{sidebar_position:0},sidebar:"tutorialSidebar",previous:{title:"Deployment \ud83d\ude80",permalink:"/docs-update/docs/re_cloud/deployment"}},l={},u=[{value:"re_cloud command line common arguments",id:"re_cloud-command-line-common-arguments",level:2},{value:"--name",id:"--name",level:3},{value:"--config-dir",id:"--config-dir",level:3},{value:"--channel-name-or-id",id:"--channel-name-or-id",level:3}],s={toc:u},d="wrapper";function p(e){let{components:t,...a}=e;return(0,o.kt)(d,(0,r.Z)({},s,a,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"configuration"},"Configuration"),(0,o.kt)("h2",{id:"re_cloud-command-line-common-arguments"},"re_cloud command line common arguments"),(0,o.kt)("p",null,"re_cloud upload command used when uploading all the data reports, support set of common arguments available for all types of uploads."),(0,o.kt)("h3",{id:"--name"},"--name"),(0,o.kt)("p",null,"Name of the upload used for identification"),(0,o.kt)("p",null,"This is the name of the upload that will be used for identification in re_cloud. If you don't pass this argument, re_cloud will use the type of the upload as the name, but we recommend you to pass it explicitly."),(0,o.kt)("p",null,"This allows you to easily distinguish between different uploads of the same type which is often needed."),(0,o.kt)("h3",{id:"--config-dir"},"--config-dir"),(0,o.kt)("p",null,"Path to the directory containing re_data.yml"),(0,o.kt)("p",null,"This is the argument you should use if you are not storing your re_data.yml file in the default location.\nJust pass the path to the directory where your re_data.yml file is stored."),(0,o.kt)("h3",{id:"--channel-name-or-id"},"--channel-name-or-id"),(0,o.kt)("p",null," The slack channel name to send the report uploaded message if a slack account is connected to the re_cloud account. It could be a channel name, channel id or member id."),(0,o.kt)("p",null," This arguments allows you to specify the slack channel where you want to receive the message about the upload. If you don't pass this argument, the message will be sent to the default slack channel which was set in re_cloud account UI."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"DashboardExample",src:n(2).Z,width:"2874",height:"1578"})),(0,o.kt)("p",null,"Screenshot of UI configuration of the default slack channel."))}p.isMDXComponent=!0},2:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/slack_config-c4158df7138b27ccde6b8375669c6680.png"}}]);