"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9116],{3905:(e,t,r)=>{r.d(t,{Zo:()=>p,kt:()=>f});var a=r(7294);function n(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,a)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){n(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,a,n=function(e,t){if(null==e)return{};var r,a,n={},o=Object.keys(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)r=o[a],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r])}return n}var s=a.createContext({}),u=function(e){var t=a.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},p=function(e){var t=u(e.components);return a.createElement(s.Provider,{value:t},e.children)},d="mdxType",c={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var r=e.components,n=e.mdxType,o=e.originalType,s=e.parentName,p=l(e,["components","mdxType","originalType","parentName"]),d=u(r),m=n,f=d["".concat(s,".").concat(m)]||d[m]||c[m]||o;return r?a.createElement(f,i(i({ref:t},p),{},{components:r})):a.createElement(f,i({ref:t},p))}));function f(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var o=r.length,i=new Array(o);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[d]="string"==typeof e?e:n,i[1]=l;for(var u=2;u<o;u++)i[u]=r[u];return a.createElement.apply(null,i)}return a.createElement.apply(null,r)}m.displayName="MDXCreateElement"},8651:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>c,frontMatter:()=>o,metadata:()=>l,toc:()=>u});var a=r(7462),n=(r(7294),r(3905));const o={sidebar_position:6},i="Q&A \ud83d\udcac",l={unversionedId:"re_data/qa",id:"re_data/qa",title:"Q&A \ud83d\udcac",description:"How do I run re_data?",source:"@site/docs/re_data/qa.md",sourceDirName:"re_data",slug:"/re_data/qa",permalink:"/0.10.8/docs/re_data/qa",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/qa.md",tags:[],version:"current",sidebarPosition:6,frontMatter:{sidebar_position:6},sidebar:"tutorialSidebar",previous:{title:"Deployment \ud83d\ude80",permalink:"/0.10.8/docs/re_data/deployment"},next:{title:"What is re_cloud?",permalink:"/0.10.8/docs/re_cloud/whatis_cloud"}},s={},u=[{value:"How do I run re_data?",id:"how-do-i-run-re_data",level:3},{value:"What are common examples of &quot;bad data&quot;?",id:"what-are-common-examples-of-bad-data",level:3},{value:"Other questions?",id:"other-questions",level:4}],p={toc:u},d="wrapper";function c(e){let{components:t,...r}=e;return(0,n.kt)(d,(0,a.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"qa-"},"Q&A \ud83d\udcac"),(0,n.kt)("h3",{id:"how-do-i-run-re_data"},"How do I run re_data?"),(0,n.kt)("p",null,"re_data doesn't have any internal scheduler and it's leaving the operation of regularly computing metrics for you to set up. We believe it's best to use existing scheduling tools your company has and we are not trying to build a new one. "),(0,n.kt)("p",null,"As re_data is a dbt package, you can (and we have installations of that) run re_data using just dbt cloud & set up jobs for computing metrics there. But definitely other methods like running it in Airflow dag are also possible."),(0,n.kt)("h3",{id:"what-are-common-examples-of-bad-data"},'What are common examples of "bad data"?'),(0,n.kt)("p",null,'Here is are a couple of problems we call "bad data":'),(0,n.kt)("ul",null,(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"Data is incomplete (or sometimes just empty)"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"Think about your data missing an important source which other team stopped a week ago"),(0,n.kt)("li",{parentName:"ul"},"is based on 1000, not 100000 rows which normally come from the source"),(0,n.kt)("li",{parentName:"ul"},"is just still empty for an important board meeting..."))),(0,n.kt)("li",{parentName:"ul"},(0,n.kt)("p",{parentName:"li"},"Data is based on erroneous assumptions"),(0,n.kt)("ul",{parentName:"li"},(0,n.kt)("li",{parentName:"ul"},"For example, you assumed there will be no ",(0,n.kt)("inlineCode",{parentName:"li"},"nulls")," in the table or from another side ",(0,n.kt)("inlineCode",{parentName:"li"},"nulls")," were supposed to be there and suddenly ",(0,n.kt)("inlineCode",{parentName:"li"},"zeroes")," appear instead breaking averages computed by reports."),(0,n.kt)("li",{parentName:"ul"},"Records in this table were not supposed to have any duplicate names, IDs, etc...")))),(0,n.kt)("h4",{id:"other-questions"},"Other questions?"),(0,n.kt)("p",null,"Have more questions? Ask as on ",(0,n.kt)("strong",{parentName:"p"},(0,n.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a"))," (we are very responsive there)"))}c.isMDXComponent=!0}}]);