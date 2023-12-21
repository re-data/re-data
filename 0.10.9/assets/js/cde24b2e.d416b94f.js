"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[3924],{3905:(e,t,o)=>{o.d(t,{Zo:()=>d,kt:()=>m});var r=o(7294);function a(e,t,o){return t in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function n(e,t){var o=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),o.push.apply(o,r)}return o}function i(e){for(var t=1;t<arguments.length;t++){var o=null!=arguments[t]?arguments[t]:{};t%2?n(Object(o),!0).forEach((function(t){a(e,t,o[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(o)):n(Object(o)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(o,t))}))}return e}function l(e,t){if(null==e)return{};var o,r,a=function(e,t){if(null==e)return{};var o,r,a={},n=Object.keys(e);for(r=0;r<n.length;r++)o=n[r],t.indexOf(o)>=0||(a[o]=e[o]);return a}(e,t);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);for(r=0;r<n.length;r++)o=n[r],t.indexOf(o)>=0||Object.prototype.propertyIsEnumerable.call(e,o)&&(a[o]=e[o])}return a}var s=r.createContext({}),u=function(e){var t=r.useContext(s),o=t;return e&&(o="function"==typeof e?e(t):i(i({},t),e)),o},d=function(e){var t=u(e.components);return r.createElement(s.Provider,{value:t},e.children)},c="mdxType",p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},h=r.forwardRef((function(e,t){var o=e.components,a=e.mdxType,n=e.originalType,s=e.parentName,d=l(e,["components","mdxType","originalType","parentName"]),c=u(o),h=a,m=c["".concat(s,".").concat(h)]||c[h]||p[h]||n;return o?r.createElement(m,i(i({ref:t},d),{},{components:o})):r.createElement(m,i({ref:t},d))}));function m(e,t){var o=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var n=o.length,i=new Array(n);i[0]=h;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l[c]="string"==typeof e?e:a,i[1]=l;for(var u=2;u<n;u++)i[u]=o[u];return r.createElement.apply(null,i)}return r.createElement.apply(null,o)}h.displayName="MDXCreateElement"},4340:(e,t,o)=>{o.r(t),o.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>p,frontMatter:()=>n,metadata:()=>l,toc:()=>u});var r=o(7462),a=(o(7294),o(3905));const n={sidebar_position:2},i="Quickstart",l={unversionedId:"re_cloud/quickstart",id:"re_cloud/quickstart",title:"Quickstart",description:"In this quick tutorial we will deploy the UI of redata & dbtdocs to production environment when you and your team can check those 2 usefull reports. This introduction assumes you are using dbt and optionally also use re_data",source:"@site/docs/re_cloud/quickstart.md",sourceDirName:"re_cloud",slug:"/re_cloud/quickstart",permalink:"/0.10.9/docs/re_cloud/quickstart",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_cloud/quickstart.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"What is re_cloud?",permalink:"/0.10.9/docs/re_cloud/whatis_cloud"},next:{title:"dbt docs",permalink:"/0.10.9/docs/re_cloud/integrations/dbt_docs"}},s={},u=[{value:"Install re_cloud package",id:"install-re_cloud-package",level:2},{value:"Configure your API key",id:"configure-your-api-key",level:2},{value:"Generate reports",id:"generate-reports",level:2},{value:"Upload reports! \ud83d\ude0a",id:"upload-reports-",level:2},{value:"View them in the cloud",id:"view-them-in-the-cloud",level:2},{value:"Invite your team",id:"invite-your-team",level:2},{value:"Configuring slack notifications",id:"configuring-slack-notifications",level:2},{value:"View reports history",id:"view-reports-history",level:2},{value:"Next steps",id:"next-steps",level:2}],d={toc:u},c="wrapper";function p(e){let{components:t,...n}=e;return(0,a.kt)(c,(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"quickstart"},"Quickstart"),(0,a.kt)("p",null,"In this quick tutorial we will deploy the UI of re_data & dbt_docs to production environment when you and your team can check those 2 usefull reports. This introduction assumes you are using dbt and optionally also use re_data"),(0,a.kt)("h2",{id:"install-re_cloud-package"},"Install re_cloud package"),(0,a.kt)("p",null,"To upload reports you will need to install ",(0,a.kt)("inlineCode",{parentName:"p"},"re_cloud")," python package, you can easily to it with pip"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"pip install re_cloud\n")),(0,a.kt)("h2",{id:"configure-your-api-key"},"Configure your API key"),(0,a.kt)("p",null,"In the ",(0,a.kt)("inlineCode",{parentName:"p"},"Account Settings")," section of the re_cloud, you can find your API key, which will be used for uploading data."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"DashboardExample",src:o(3551).Z,width:"2880",height:"948"})),(0,a.kt)("p",null,"Then paste this into your ",(0,a.kt)("inlineCode",{parentName:"p"},"re_data.yml")," configuration file. You can create this file anywhere on your system.\nre_cloud has default location where it's looking for in home directory ",(0,a.kt)("inlineCode",{parentName:"p"},".re_data")," folder. (",(0,a.kt)("inlineCode",{parentName:"p"},"~/.re_data/re_data.yml")," for file path re_cloud used as default)"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-yml",metastring:'title="re_data.yml"',title:'"re_data.yml"'},"re_cloud:\n  api_key: YOUR_KEY_HERE\n")),(0,a.kt)("h2",{id:"generate-reports"},"Generate reports"),(0,a.kt)("p",null,"If you didn't yet generated dbt docs and re_data reports you can do it now. ",(0,a.kt)("inlineCode",{parentName:"p"},"cd")," to your dbt project catalog and run:"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"dbt docs generate\nre_data overview generate\n")),(0,a.kt)("admonition",{type:"info"},(0,a.kt)("p",{parentName:"admonition"},"This commands require you to have dbt & re_data configured for the project. In case you just use dbt docs not re_data you can skip the second command. If you don't use any of it, check our instructions other tools we support.")),(0,a.kt)("h2",{id:"upload-reports-"},"Upload reports! \ud83d\ude0a"),(0,a.kt)("p",null,"Now with just 2 commands we can upload our reports to cloud"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"re_cloud upload dbt-docs --config-dir /path/to/re_data_yml_dir\nre_cloud upload re-data --config-dir /path/to/re_data_yml_dir\n")),(0,a.kt)("p",null,"In case you stored your ",(0,a.kt)("inlineCode",{parentName:"p"},"re_data.yml")," in the default location you can skip ",(0,a.kt)("inlineCode",{parentName:"p"},"--config-dir")," flag."),(0,a.kt)("h2",{id:"view-them-in-the-cloud"},"View them in the cloud"),(0,a.kt)("p",null,"Now you cloud account should contain 2 additional reports with recent upload times. Something like this:"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"DashboardExample",src:o(6296).Z,width:"2874",height:"1590"})),(0,a.kt)("p",null,"re_cloud supports uploading a couple of different reports, let's check all of them \ud83d\ude0a "),(0,a.kt)("h2",{id:"invite-your-team"},"Invite your team"),(0,a.kt)("p",null,"Inviting your team is super easy, just click on the ",(0,a.kt)("inlineCode",{parentName:"p"},"Invite")," button in the top right corner and add emails of your team members."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"DashboardExample",src:o(3401).Z,width:"2880",height:"1590"})),(0,a.kt)("h2",{id:"configuring-slack-notifications"},"Configuring slack notifications"),(0,a.kt)("p",null,"If you would like to configure slack notifications for your reports, you can do it in the ",(0,a.kt)("inlineCode",{parentName:"p"},"Account Settings")," section of the re_cloud."),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"DashboardExample",src:o(787).Z,width:"2872",height:"1018"})),(0,a.kt)("h2",{id:"view-reports-history"},"View reports history"),(0,a.kt)("p",null,"Let's update our reports again and see how it looks like in the cloud"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"re_cloud upload dbt-docs --config-dir /path/to/re_data_yml_dir\nre_cloud upload re-data --config-dir /path/to/re_data_yml_dir\n")),(0,a.kt)("p",null,"Now you should be able to see something like this in your dbt docs or re_data reports:"),(0,a.kt)("p",null,(0,a.kt)("img",{alt:"DashboardExample",src:o(5799).Z,width:"2880",height:"1308"})),(0,a.kt)("h2",{id:"next-steps"},"Next steps"),(0,a.kt)("p",null,"Now you can start using re_cloud to share your reports with your team and business users. If you would like to learn more joing our ",(0,a.kt)("strong",{parentName:"p"},(0,a.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a"))," community or check the rest of our docs!"))}p.isMDXComponent=!0},6296:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/dashboard-a0a86286085f40c813881bbc2819f8fd.png"},3551:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/getapikey-b04b2be087fa1aed84360a19d67b4be4.png"},5799:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/history-f9b2463b53f1514a28a33d8d544062ae.png"},3401:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/invite-61aac42b04c529d34f9518ec85cd6c3c.png"},787:(e,t,o)=>{o.d(t,{Z:()=>r});const r=o.p+"assets/images/slack-5a67bc8f61a4a6a2d69566b0f31c26ee.png"}}]);