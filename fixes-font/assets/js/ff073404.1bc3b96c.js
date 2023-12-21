"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[7526],{3905:(e,t,o)=>{o.d(t,{Zo:()=>c,kt:()=>y});var r=o(7294);function n(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function a(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,r)}return o}function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?a(Object(o),!0).forEach((function(t){n(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):a(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function l(e,t){if(null==e)return{};var o,r,n=function(e,t){if(null==e)return{};var o,r,n={},a=Object.keys(e);for(r=0;r<a.length;r++)o=a[r],t.indexOf(o)>=0||(n[o]=e[o]);return n}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)o=a[r],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(n[o]=e[o])}return n}var u=r.createContext({}),p=function(e){var t=r.useContext(u),o=t;return e&&(o="function"==typeof e?e(t):i(i({},t),e)),o},c=function(e){var t=p(e.components);return r.createElement(u.Provider,{value:t},e.children)},s="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var o=e.components,n=e.mdxType,a=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),s=p(o),f=n,y=s["".concat(u,".").concat(f)]||s[f]||d[f]||a;return o?r.createElement(y,i(i({ref:t},c),{},{components:o})):r.createElement(y,i({ref:t},c))}));function y(e,t){var o=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var a=o.length,i=new Array(a);i[0]=f;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l[s]="string"==typeof e?e:n,i[1]=l;for(var p=2;p<a;p++)i[p]=o[p];return r.createElement.apply(null,i)}return r.createElement.apply(null,o)}f.displayName="MDXCreateElement"},664:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>u,contentTitle:()=>i,default:()=>s,frontMatter:()=>a,metadata:()=>l,toc:()=>p});var r=o(7462),n=(o(7294),o(3905));const a={},i="Jupyter notebook",l={unversionedId:"re_cloud/integrations/jupyter_notebook",id:"re_cloud/integrations/jupyter_notebook",title:"Jupyter notebook",description:"Overview",source:"@site/docs/re_cloud/integrations/jupyter_notebook.md",sourceDirName:"re_cloud/integrations",slug:"/re_cloud/integrations/jupyter_notebook",permalink:"/fixes-font/docs/re_cloud/integrations/jupyter_notebook",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_cloud/integrations/jupyter_notebook.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"great-expectations",permalink:"/fixes-font/docs/re_cloud/integrations/great_expectations"},next:{title:"pandas-profiling",permalink:"/fixes-font/docs/re_cloud/integrations/pandas_profiling"}},u={},p=[{value:"Overview",id:"overview",level:2},{value:"Uploading to re_cloud",id:"uploading-to-re_cloud",level:2},{value:"re_cloud command",id:"re_cloud-command",level:2}],c={toc:p};function s(e){let{components:t,...a}=e;return(0,n.kt)("wrapper",(0,r.Z)({},c,a,{components:t,mdxType:"MDXLayout"}),(0,n.kt)("h1",{id:"jupyter-notebook"},"Jupyter notebook"),(0,n.kt)("h2",{id:"overview"},"Overview"),(0,n.kt)("p",null,"Jupyter notebooks are super common way to work with data. There are couple of online tools for editing notebooks, currently focuses on supporting orginal \ud83d\ude42 open-source python library and sharing results of your notebooks with other people in the company. re_cloud allows you to transform your jupyter notebooks to HTML and easily share with others."),(0,n.kt)("p",null,(0,n.kt)("img",{alt:"jupyter_notebook_example",src:o(9737).Z,width:"1138",height:"758"})),(0,n.kt)("h2",{id:"uploading-to-re_cloud"},"Uploading to re_cloud"),(0,n.kt)("p",null,"In order to upload jupyter notebook to re_cloud run:"),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"re_cloud upload jupyter-notebook --file your_notedbook_file\n\n")),(0,n.kt)("h2",{id:"re_cloud-command"},"re_cloud command"),(0,n.kt)("p",null,"Below we show all the currently supported options on how you can upload jupyter-notebook to ",(0,n.kt)("inlineCode",{parentName:"p"},"re_cloud")),(0,n.kt)("pre",null,(0,n.kt)("code",{parentName:"pre"},"Usage: re_cloud upload jupyter-notebook --name TEXT  --file TEXT\n\nOptions:\n  --file TEXT  ipynb notebooks file to upload  [required]\n  --name TEXT  Name of the upload used for identification\n  --help       Show this message and exit.\n")))}s.isMDXComponent=!0},9737:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/jupyter_notebook-90e2d3e2b3693a6d36d0180f02b02c32.png"}}]);