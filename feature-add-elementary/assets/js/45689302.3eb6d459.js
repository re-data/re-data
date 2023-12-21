"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3661],{3905:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>m});var r=n(7294);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var p=r.createContext({}),d=function(e){var t=r.useContext(p),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},s=function(e){var t=d(e.components);return r.createElement(p.Provider,{value:t},e.children)},c="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,p=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),c=d(n),f=a,m=c["".concat(p,".").concat(f)]||c[f]||u[f]||o;return n?r.createElement(m,i(i({ref:t},s),{},{components:n})):r.createElement(m,i({ref:t},s))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,i=new Array(o);i[0]=f;var l={};for(var p in t)hasOwnProperty.call(t,p)&&(l[p]=t[p]);l.originalType=e,l[c]="string"==typeof e?e:a,i[1]=l;for(var d=2;d<o;d++)i[d]=n[d];return r.createElement.apply(null,i)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},5932:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>u,frontMatter:()=>o,metadata:()=>l,toc:()=>d});var r=n(7462),a=(n(7294),n(3905));const o={sidebar_position:5},i="pandas-profiling",l={unversionedId:"re_cloud/integrations/pandas_profiling",id:"re_cloud/integrations/pandas_profiling",title:"pandas-profiling",description:"Overview",source:"@site/docs/re_cloud/integrations/pandas_profiling.md",sourceDirName:"re_cloud/integrations",slug:"/re_cloud/integrations/pandas_profiling",permalink:"/feature-add-elementary/docs/re_cloud/integrations/pandas_profiling",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_cloud/integrations/pandas_profiling.md",tags:[],version:"current",sidebarPosition:5,frontMatter:{sidebar_position:5},sidebar:"tutorialSidebar",previous:{title:"Jupyter notebook",permalink:"/feature-add-elementary/docs/re_cloud/integrations/jupyter_notebook"},next:{title:"HTML file",permalink:"/feature-add-elementary/docs/re_cloud/integrations/html"}},p={},d=[{value:"Overview",id:"overview",level:2},{value:"Uploading to re_cloud",id:"uploading-to-re_cloud",level:2},{value:"re_cloud command",id:"re_cloud-command",level:2},{value:"Next steps",id:"next-steps",level:2}],s={toc:d},c="wrapper";function u(e){let{components:t,...o}=e;return(0,a.kt)(c,(0,r.Z)({},s,o,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"pandas-profiling"},"pandas-profiling"),(0,a.kt)("h2",{id:"overview"},"Overview"),(0,a.kt)("p",null,"Pandas-profiling is a python library which can you help you profile any pandas dataframe.\nIt will automatically generate insights about:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},"each of your columns "),(0,a.kt)("li",{parentName:"ul"},"correlations between them"),(0,a.kt)("li",{parentName:"ul"},"missing values"),(0,a.kt)("li",{parentName:"ul"},"alerts")),(0,a.kt)("p",null,"in your dataframe data."),(0,a.kt)("p",null,"You can think of it as a extension of pandas native ",(0,a.kt)("a",{parentName:"p",href:"https://pandas.pydata.org/docs/reference/api/pandas.DataFrame.describe.html"},"describe command")),(0,a.kt)("p",null,"Pandas profiling report is most often saved to HTML file to be inspected by data team and potentially data consumers. Below view of the example pandas-profiling output:"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"pandas_profiling_example",src:n(2907).Z,width:"2878",height:"1580"})),(0,a.kt)("h2",{id:"uploading-to-re_cloud"},"Uploading to re_cloud"),(0,a.kt)("p",null,"To collaborate on your pandas-profiling reports, you can easily upload it to re_cloud.\nGenerating pandas profiling report is really easy:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-python"},'from pandas_profiling import ProfileReport\n...\nprofile = ProfileReport(df, title="Pandas Profiling Report")\nprofile.to_file("report.html")\n')),(0,a.kt)("p",null,"Once generated you can upload report to the cloud:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"re_cloud upload pandas-profiling --report-file report.html\n")),(0,a.kt)("h2",{id:"re_cloud-command"},"re_cloud command"),(0,a.kt)("p",null,"Below we show all the currently supported options on how you can upload pandas-profiling to ",(0,a.kt)("inlineCode",{parentName:"p"},"re_cloud")),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre"},"re_cloud upload pandas-profiling --name TEXT  --report-file TEXT\n\nOptions:\n  --channel-name-or-id TEXT  The slack channel name to send the report\n                             uploaded message if a slack account is connected\n                             to the re_cloud account. It could be a channel\n                             name, channel id or member id.\n  --name TEXT                Name of the upload used for identification\n  --config-dir TEXT          Path to the directory containing re_data.yml\n                             config file\n  --report-file TEXT         Pandas profiling file with html report\n                             [required]\n  --help                     Show this message and exit.\n")),(0,a.kt)("p",null,"For pandas profiling --report-file is required paramter. re_data will upload your docs in ",(0,a.kt)("inlineCode",{parentName:"p"},"uncommitted/data_docs/local_site/")," path then."),(0,a.kt)("h2",{id:"next-steps"},"Next steps"),(0,a.kt)("p",null,"If you would like to jump into uploading data you can create your ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("a",{parentName:"strong",href:"https://cloud.getre.io/#/register"},"free account here \ud83d\ude0a"))," if you have more questions for us: don't be reluctant to join our ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a"))))}u.isMDXComponent=!0},2907:(e,t,n)=>{n.d(t,{Z:()=>r});const r=n.p+"assets/images/pandas_profiling-9679187b7f082d3547b3eae6c67117b2.png"}}]);