"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[5293],{3905:(e,t,a)=>{a.d(t,{Zo:()=>p,kt:()=>h});var n=a(7294);function o(e,t,a){return t in e?Object.defineProperty(e,t,{value:a,enumerable:!0,configurable:!0,writable:!0}):e[t]=a,e}function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}function i(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(Object(a),!0).forEach((function(t){o(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(Object(a)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}function s(e,t){if(null==e)return{};var a,n,o=function(e,t){if(null==e)return{};var a,n,o={},r=Object.keys(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||(o[a]=e[a]);return o}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(n=0;n<r.length;n++)a=r[n],t.indexOf(a)>=0||Object.prototype.propertyIsEnumerable.call(e,a)&&(o[a]=e[a])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),a=t;return e&&(a="function"==typeof e?e(t):i(i({},t),e)),a},p=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},d="mdxType",u={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var a=e.components,o=e.mdxType,r=e.originalType,l=e.parentName,p=s(e,["components","mdxType","originalType","parentName"]),d=c(a),m=o,h=d["".concat(l,".").concat(m)]||d[m]||u[m]||r;return a?n.createElement(h,i(i({ref:t},p),{},{components:a})):n.createElement(h,i({ref:t},p))}));function h(e,t){var a=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var r=a.length,i=new Array(r);i[0]=m;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:o,i[1]=s;for(var c=2;c<r;c++)i[c]=a[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,a)}m.displayName="MDXCreateElement"},3442:(e,t,a)=>{a.r(t),a.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>u,frontMatter:()=>r,metadata:()=>s,toc:()=>c});var n=a(7462),o=(a(7294),a(3905));const r={sidebar_position:4},i="Notifications",s={unversionedId:"re_data/getting_started/toy_shop/notifications",id:"re_data/getting_started/toy_shop/notifications",title:"Notifications",description:"Notifications are a great way to stay up to date with activities in your warehouse. You can let re_data send you notifications for alerts that occured within a specified date range.",source:"@site/docs/re_data/getting_started/toy_shop/notifications.md",sourceDirName:"re_data/getting_started/toy_shop",slug:"/re_data/getting_started/toy_shop/notifications",permalink:"/0.10.9/docs/re_data/getting_started/toy_shop/notifications",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/getting_started/toy_shop/notifications.md",tags:[],version:"current",sidebarPosition:4,frontMatter:{sidebar_position:4},sidebar:"tutorialSidebar",previous:{title:"Reliability UI \ud83d\udc40",permalink:"/0.10.9/docs/re_data/getting_started/toy_shop/generate_ui"},next:{title:"Configuration \u2699\ufe0f",permalink:"/0.10.9/docs/re_data/reference/config"}},l={},c=[{value:"Slack",id:"slack",level:2},{value:"Email",id:"email",level:2}],p={toc:c},d="wrapper";function u(e){let{components:t,...r}=e;return(0,o.kt)(d,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"notifications"},"Notifications"),(0,o.kt)("p",null,"Notifications are a great way to stay up to date with activities in your warehouse. You can let re_data send you notifications for alerts that occured within a specified date range."),(0,o.kt)("p",null,"re_data currently supports the following channels for notifications."),(0,o.kt)("h2",{id:"slack"},"Slack"),(0,o.kt)("p",null,"To send alerts to a slack channel, we make use of ",(0,o.kt)("a",{parentName:"p",href:"https://api.slack.com/messaging/webhooks"},"incoming webhooks")," which is a simple way to post messages from apps into Slack."),(0,o.kt)("p",null,"The steps required to enable incoming webhooks and get started can be found in the slack ",(0,o.kt)("a",{parentName:"p",href:"https://api.slack.com/messaging/webhooks#enable_webhooks"},"API docs"),". Once you have created an incoming webhook successfully, you should see a new entry under Webhook URLs for Your Workspace section, with a Webhook URL that'll look something like this:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX\n")),(0,o.kt)("p",null,"The webhook url can now be used with the re_data notify command as shown below,"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},'re_data notify slack \\\n--start-date 2021-01-01 \\\n--end-date 2021-01-31 \\\n--webhook-url https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX \\\n--subtitle="[Optional] Markdown text to be added as a subtitle in the slack message generated"\n')),(0,o.kt)("p",null,"or configure in re_data.yml"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="~/.re_data/re_data.yml"',title:'"~/.re_data/re_data.yml"'},"notifications:\n  slack:\n    webhook_url: https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX\n")),(0,o.kt)("p",null,"Below is a sample alert notification message sent by a slack app created."),(0,o.kt)("p",null,(0,o.kt)("img",{alt:"SlackMessage",src:a(7964).Z,width:"912",height:"575"})),(0,o.kt)("p",null,"By default, the most recent 10 alerts are shown (for each table) and you can generate the Observability UI to show more details relating to alerts."),(0,o.kt)("h2",{id:"email"},"Email"),(0,o.kt)("p",null,"Before you can send alerts via email, you need to have configured an email account on the SMTP server you are going to use to send the email."),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="~/.re_data/re_data.yml"',title:'"~/.re_data/re_data.yml"'},"notifications:\n  email:\n    mail_from: notifications@getre.io\n    smtp_host: smtp.sendgrid.net\n    smtp_port: 465\n    smtp_user: username\n    smtp_password: xxxxx\n    use_ssl: true\n    use_tls: false\n")),(0,o.kt)("p",null,"If you configure both ",(0,o.kt)("inlineCode",{parentName:"p"},"use_ssl: true")," & ",(0,o.kt)("inlineCode",{parentName:"p"},"use_tls: true")," the tls protocol will be used. TLS will enable you to use different mail ports which SSL does not support on some mail servers, eg ",(0,o.kt)("inlineCode",{parentName:"p"},"587"),"."),(0,o.kt)("p",null,"Email alerts can now be sent using the command as shown below"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre",className:"language-bash"},"re_data notify email \\\n--start-date 2021-01-01 \\\n--end-date 2021-01-31\n")),(0,o.kt)("admonition",{type:"info"},(0,o.kt)("h3",{parentName:"admonition",id:"having-issues"},"Having issues?"),(0,o.kt)("p",{parentName:"admonition"},"If you have more questions, got stuck anywhere, or something is not working as expected, please let us know on ",(0,o.kt)("strong",{parentName:"p"},(0,o.kt)("a",{parentName:"strong",href:"https://www.getre.io/slack"},"Slack! \ud83d\ude0a")),", we will help you asap, and it will help us improve this quick start guide.")))}u.isMDXComponent=!0},7964:(e,t,a)=>{a.d(t,{Z:()=>n});const n=a.p+"assets/images/slack_notification_message-107d8444dc9ce50a7ddc70790a849989.png"}}]);