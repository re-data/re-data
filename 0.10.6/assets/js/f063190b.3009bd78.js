"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6983],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function c(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var l=n.createContext({}),s=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},p=function(e){var t=s(e.components);return n.createElement(l.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,l=e.parentName,p=c(e,["components","mdxType","originalType","parentName"]),u=s(r),f=a,m=u["".concat(l,".").concat(f)]||u[f]||d[f]||i;return r?n.createElement(m,o(o({ref:t},p),{},{components:r})):n.createElement(m,o({ref:t},p))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=u;var c={};for(var l in t)hasOwnProperty.call(t,l)&&(c[l]=t[l]);c.originalType=e,c.mdxType="string"==typeof e?e:a,o[1]=c;for(var s=2;s<i;s++)o[s]=r[s];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},4333:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>d,frontMatter:()=>i,metadata:()=>c,toc:()=>s});var n=r(7462),a=(r(7294),r(3905));const i={sidebar_position:0},o="Init",c={unversionedId:"re_data/reference/cli/init",id:"re_data/reference/cli/init",title:"Init",description:"redata init CLI command is used for initialiazing a dbt project from scratch with redata setup.",source:"@site/docs/re_data/reference/cli/init.md",sourceDirName:"re_data/reference/cli",slug:"/re_data/reference/cli/init",permalink:"/0.10.6/docs/re_data/reference/cli/init",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/reference/cli/init.md",tags:[],version:"current",sidebarPosition:0,frontMatter:{sidebar_position:0},sidebar:"tutorialSidebar",previous:{title:"Configuration \u2699\ufe0f",permalink:"/0.10.6/docs/re_data/reference/config"},next:{title:"Overview",permalink:"/0.10.6/docs/re_data/reference/cli/overview"}},l={},s=[{value:"init",id:"init-1",level:2}],p={toc:s};function d(e){let{components:t,...r}=e;return(0,a.kt)("wrapper",(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"init"},"Init"),(0,a.kt)("p",null,(0,a.kt)("inlineCode",{parentName:"p"},"re_data init")," CLI command is used for initialiazing a dbt project from scratch with re_data setup."),(0,a.kt)("h2",{id:"init-1"},"init"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"re_data init project_name\n")),(0,a.kt)("p",null,"This creates a folder with a valid dbt project setup. The ",(0,a.kt)("inlineCode",{parentName:"p"},"name")," and ",(0,a.kt)("inlineCode",{parentName:"p"},"profile")," values in the ",(0,a.kt)("inlineCode",{parentName:"p"},"dbt_project.yml")," would use the project_name specified as argument to the command."),(0,a.kt)("p",null,"The project setup contains two seed files:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"toy_shop/seeds/customers.csv"),(0,a.kt)("li",{parentName:"ul"},"toy_shop/seeds/orders.csv")),(0,a.kt)("p",null,"And it also contains one model:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"toy_shop/models/pending_orders_per_customer.sql")),(0,a.kt)("p",null,"which is used to showcase a ",(0,a.kt)("a",{parentName:"p",href:"/docs/re_data/getting_started/toy_shop/toy_shop_data"},"toy_shop project")," using re_data."))}d.isMDXComponent=!0}}]);