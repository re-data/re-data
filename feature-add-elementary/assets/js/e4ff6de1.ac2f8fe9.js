"use strict";(self.webpackChunkwebsite=self.webpackChunkwebsite||[]).push([[6809],{3905:(e,n,t)=>{t.d(n,{Zo:()=>d,kt:()=>m});var r=t(7294);function i(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function a(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function o(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?a(Object(t),!0).forEach((function(n){i(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):a(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function s(e,n){if(null==e)return{};var t,r,i=function(e,n){if(null==e)return{};var t,r,i={},a=Object.keys(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||(i[t]=e[t]);return i}(e,n);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(r=0;r<a.length;r++)t=a[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(i[t]=e[t])}return i}var l=r.createContext({}),c=function(e){var n=r.useContext(l),t=n;return e&&(t="function"==typeof e?e(n):o(o({},n),e)),t},d=function(e){var n=c(e.components);return r.createElement(l.Provider,{value:n},e.children)},f="mdxType",u={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},p=r.forwardRef((function(e,n){var t=e.components,i=e.mdxType,a=e.originalType,l=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),f=c(t),p=i,m=f["".concat(l,".").concat(p)]||f[p]||u[p]||a;return t?r.createElement(m,o(o({ref:n},d),{},{components:t})):r.createElement(m,o({ref:n},d))}));function m(e,n){var t=arguments,i=n&&n.mdxType;if("string"==typeof e||i){var a=t.length,o=new Array(a);o[0]=p;var s={};for(var l in n)hasOwnProperty.call(n,l)&&(s[l]=n[l]);s.originalType=e,s[f]="string"==typeof e?e:i,o[1]=s;for(var c=2;c<a;c++)o[c]=t[c];return r.createElement.apply(null,o)}return r.createElement.apply(null,t)}p.displayName="MDXCreateElement"},9414:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>l,contentTitle:()=>o,default:()=>u,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var r=t(7462),i=(t(7294),t(3905));const a={sidebar_position:1},o="Owners",s={unversionedId:"re_data/reference/notifications/configuring_owners",id:"re_data/reference/notifications/configuring_owners",title:"Owners",description:"Setting up owners for models, allows you to alert about the problem specific groups of people. This is realised either by mentioning on the Slack channel or in case of email, sending information only to specific people.",source:"@site/docs/re_data/reference/notifications/configuring_owners.md",sourceDirName:"re_data/reference/notifications",slug:"/re_data/reference/notifications/configuring_owners",permalink:"/feature-add-elementary/docs/re_data/reference/notifications/configuring_owners",draft:!1,editUrl:"https://github.com/re-data/re-data/edit/master/docs/docs/re_data/reference/notifications/configuring_owners.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Anomalies",permalink:"/feature-add-elementary/docs/re_data/reference/anomaly_detection"},next:{title:"Configuring Channels and Sending Alerts",permalink:"/feature-add-elementary/docs/re_data/reference/notifications/configuring_channels"}},l={},c=[{value:"re_data:owners_config",id:"re_dataowners_config",level:3},{value:"re_data_owners",id:"re_data_owners",level:3}],d={toc:c},f="wrapper";function u(e){let{components:n,...t}=e;return(0,i.kt)(f,(0,r.Z)({},d,t,{components:n,mdxType:"MDXLayout"}),(0,i.kt)("h1",{id:"owners"},"Owners"),(0,i.kt)("p",null,"Setting up owners for models, allows you to alert about the problem specific groups of people. This is realised either by mentioning on the Slack channel or in case of email, sending information only to specific people."),(0,i.kt)("p",null,"Setting re_data owners is optional and re_data notification can work without any owners setup."),(0,i.kt)("h3",{id:"re_dataowners_config"},"re_data:owners_config"),(0,i.kt)("p",null,"Mapping of re_data model owners and their identifier is defined in the ",(0,i.kt)("inlineCode",{parentName:"p"},"re_data:owners_config")," block in the dbt_project.yml file.\nHere we can define an individual user or a group of users (team) with their respective identifiers.\nEach owner definition consists of "),(0,i.kt)("ul",null,(0,i.kt)("li",{parentName:"ul"},"type: what kind of channel the identifier is used for. email | slack"),(0,i.kt)("li",{parentName:"ul"},"identifier: unique identifier used for the specified channel, e.g. slack member_id | email"),(0,i.kt)("li",{parentName:"ul"},"name: name associated with the identifier")),(0,i.kt)("p",null,"An example configuration is shown below"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="dbt_project.yml"',title:'"dbt_project.yml"'},"vars:\n  re_data:owners_config:\n    user1:\n      - type: slack\n        identifier: U02FHBSXXXX\n        name: user1\n    backend:\n      - type: email\n        identifier: user1@getre.io\n        name: user1\n\n      - type: email\n        identifier: user2@getre.io\n        name: user2\n\n      - type: slack\n        identifier: U01F80NXXYY\n        name: user2\n\n      - type: slack\n        identifier: U02FHBSXXXX\n        name: user1\n    frontend:\n      - type: slack\n        identifier: U02FHBSXXXX\n        name: user1\n\n      - type: email\n        identifier: user2@getre.io\n        name: user2\n")),(0,i.kt)("h3",{id:"re_data_owners"},"re_data_owners"),(0,i.kt)("pre",null,(0,i.kt)("code",{parentName:"pre",className:"language-yaml",metastring:'title="models/orders.sql"',title:'"models/orders.sql"'},"{{\n    config(\n        re_data_anomaly_detector={'name': 'z_score', 'threshold': 2.0},\n        re_data_owners=['backend'],\n    )\n}}\n")),(0,i.kt)("p",null,"In the configuration above, re_data_owners consists of the backend team, user1 and user2 would be notified on any alerts relating to this model."))}u.isMDXComponent=!0}}]);