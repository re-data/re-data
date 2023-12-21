"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[9299],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>f});var a=n(7294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),u=c(n),d=r,f=u["".concat(l,".").concat(d)]||u[d]||m[d]||s;return n?a.createElement(f,o(o({ref:t},p),{},{components:n})):a.createElement(f,o({ref:t},p))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,o=new Array(s);o[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:r,o[1]=i;for(var c=2;c<s;c++)o[c]=n[c];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},758:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>o,default:()=>m,frontMatter:()=>s,metadata:()=>i,toc:()=>c});var a=n(7462),r=(n(7294),n(3905));const s={sidebar_position:2},o="Configuring Channels and Sending Alerts",i={unversionedId:"re_data/reference/notifications/configuring_channels",id:"re_data/reference/notifications/configuring_channels",title:"Configuring Channels and Sending Alerts",description:"Before using the notify command to send alerts, we need to configure the respective channels.",source:"@site/docs/re_data/reference/notifications/configuring_channels.md",sourceDirName:"re_data/reference/notifications",slug:"/re_data/reference/notifications/configuring_channels",permalink:"/0.10.8/docs/re_data/reference/notifications/configuring_channels",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/reference/notifications/configuring_channels.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{sidebar_position:2},sidebar:"tutorialSidebar",previous:{title:"Owners",permalink:"/0.10.8/docs/re_data/reference/notifications/configuring_owners"},next:{title:"Table Samples",permalink:"/0.10.8/docs/re_data/reference/table_samples"}},l={},c=[{value:"Slack",id:"slack",level:2},{value:"Email",id:"email",level:2}],p={toc:c},u="wrapper";function m(e){let{components:t,...s}=e;return(0,r.kt)(u,(0,a.Z)({},p,s,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"configuring-channels-and-sending-alerts"},"Configuring Channels and Sending Alerts"),(0,r.kt)("p",null,"Before using the notify command to send alerts, we need to configure the respective channels."),(0,r.kt)("h2",{id:"slack"},"Slack"),(0,r.kt)("p",null,"To send alerts to a slack channel, we make use of ",(0,r.kt)("a",{parentName:"p",href:"https://api.slack.com/messaging/webhooks"},"incoming webhooks")," which is a simple way to post messages from apps into Slack."),(0,r.kt)("p",null,"The steps required to enable incoming webhooks and get started can be found in the slack ",(0,r.kt)("a",{parentName:"p",href:"https://api.slack.com/messaging/webhooks#enable_webhooks"},"API docs"),". Once you have created an incoming webhook successfully, you should see a new entry under Webhook URLs for Your Workspace section, with a Webhook URL that'll look something like this:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX\n")),(0,r.kt)("p",null,"The webhook url can now be used with the re_data notify command as shown below,"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},'re_data notify slack \\\n--start-date 2021-01-01 \\\n--end-date 2021-01-31 \\\n--webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX \\\n--select anomaly \\\n--select test \\\n--select schema_change \\\n--subtitle="[Optional] Markdown text to be added as a subtitle in the slack message generated"\n')),(0,r.kt)("p",null,"or configure in re_data.yml"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="~/.re_data/re_data.yml"',title:'"~/.re_data/re_data.yml"'},"notifications:\n  slack:\n    webhook_url: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX\n")),(0,r.kt)("p",null,"Below is a sample alert notification message sent by a slack app created."),(0,r.kt)("p",null,(0,r.kt)("img",{alt:"SlackMessage",src:n(7964).Z,width:"912",height:"575"})),(0,r.kt)("p",null,"By default, the most recent 10 alerts are shown (for each table) and you can generate the Observability UI to show more details relating to alerts."),(0,r.kt)("h2",{id:"email"},"Email"),(0,r.kt)("p",null,"Before you can send alerts via email, you need to have configured an email account on the SMTP server you are going to use to send the email."),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"mail_from: Email address to set as the email's from"),(0,r.kt)("li",{parentName:"ul"},"smtp_host: SMTP server to use"),(0,r.kt)("li",{parentName:"ul"},"smtp_port: SMTP port to use"),(0,r.kt)("li",{parentName:"ul"},"smtp_user: SMTP user to use"),(0,r.kt)("li",{parentName:"ul"},"smtp_password: SMTP password to use"),(0,r.kt)("li",{parentName:"ul"},"use_ssl: Use SSL to connect to SMTP server"),(0,r.kt)("li",{parentName:"ul"},"use_tls: Use TLS to connect to SMTP server")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="~/.re_data/re_data.yml"',title:'"~/.re_data/re_data.yml"'},"notifications:\n  email:\n    mail_from: notifications@getre.io\n    smtp_host: smtp.sendgrid.net\n    smtp_port: 465\n    smtp_user: username\n    smtp_password: xxxxx\n    use_ssl: true\n    use_tls: false\n")),(0,r.kt)("p",null,"Email alerts can now be sent using the command as shown below"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-bash"},"re_data notify email \\\n--start-date 2021-01-01 \\\n--end-date 2021-01-31 \\\n--select anomaly \\\n--select test \\\n--select schema_change\n")),(0,r.kt)("p",null,"Below is a sample alert notification message sent by a slack app created.\n",(0,r.kt)("img",{alt:"EmailAlertMessage",src:n(4578).Z,width:"959",height:"859"})),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("h3",{parentName:"admonition",id:"having-issues"},"Having issues?"),(0,r.kt)("p",{parentName:"admonition"},"If you have more questions, got stuck anywhere, or something is not working as expected, please let us know on ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a")),", we will help you asap, and it will help us improve this quick start guide.")))}m.isMDXComponent=!0},4578:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/email_notification_message-f9f5e83c9bef2e4808fc8f0ff0c0cb66.png"},7964:(e,t,n)=>{n.d(t,{Z:()=>a});const a=n.p+"assets/images/slack_notification_message-107d8444dc9ce50a7ddc70790a849989.png"}}]);