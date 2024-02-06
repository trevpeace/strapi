"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[3991],{4665:(e,t,n)=>{n.d(t,{Z:()=>g});var r=n(7294),o=n(6010),c=n(1976),a=n(8746),i=n(1699),s=n(1614);const l="cardContainer_fWXF",u="cardTitle_rnsV",p="cardDescription_PWke";function d(e){let{href:t,children:n}=e;return r.createElement(a.Z,{href:t,className:(0,o.Z)("card padding--lg",l)},n)}function m(e){let{href:t,icon:n,title:c,description:a}=e;return r.createElement(d,{href:t},r.createElement("h2",{className:(0,o.Z)("text--truncate",u),title:c},n," ",c),a&&r.createElement("p",{className:(0,o.Z)("text--truncate",p),title:a},a))}function f(e){let{item:t}=e;const n=(0,c.Wl)(t);return n?r.createElement(m,{href:n,icon:"\ud83d\uddc3\ufe0f",title:t.label,description:(0,s.I)({message:"{count} items",id:"theme.docs.DocCard.categoryDescription",description:"The default description for a category card in the generated index about how many items this category includes"},{count:t.items.length})}):null}function h(e){var t;let{item:n}=e;const o=(0,i.Z)(n.href)?"\ud83d\udcc4\ufe0f":"\ud83d\udd17",a=(0,c.xz)(null!=(t=n.docId)?t:void 0);return r.createElement(m,{href:n.href,icon:o,title:n.label,description:null==a?void 0:a.description})}function y(e){let{item:t}=e;switch(t.type){case"link":return r.createElement(h,{item:t});case"category":return r.createElement(f,{item:t});default:throw new Error("unknown item type "+JSON.stringify(t))}}function b(e){let{className:t}=e;const n=(0,c.jA)();return r.createElement(g,{items:n.items,className:t})}function g(e){const{items:t,className:n}=e;if(!t)return r.createElement(b,e);const a=(0,c.MN)(t);return r.createElement("section",{className:(0,o.Z)("row",n)},a.map(((e,t)=>r.createElement("article",{key:t,className:"col col--6 margin-bottom--lg"},r.createElement(y,{item:e})))))}},4445:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>u,contentTitle:()=>s,default:()=>m,frontMatter:()=>i,metadata:()=>l,toc:()=>p});var r=n(3117),o=(n(7294),n(3905)),c=n(4665),a=n(1976);const i={title:"Introduction",tags:["content-releases"]},s="Content Releases",l={unversionedId:"docs/core/content-releases/intro",id:"docs/core/content-releases/intro",title:"Introduction",description:"A release contains various content entries, each capable of being assigned a specific action such as publish or unpublish. Within a release, entries may be in different locales or come from different content types. With a simple click of a button, a release can execute the designated action for each entry. Content Releases is an enterprise edition feature.",source:"@site/docs/docs/01-core/content-releases/00-intro.md",sourceDirName:"docs/01-core/content-releases",slug:"/docs/core/content-releases/intro",permalink:"/docs/core/content-releases/intro",draft:!1,editUrl:"https://github.com/strapi/strapi/tree/main/docs/docs/docs/01-core/content-releases/00-intro.md",tags:[{label:"content-releases",permalink:"/tags/content-releases"}],version:"current",sidebarPosition:0,frontMatter:{title:"Introduction",tags:["content-releases"]},sidebar:"docs",previous:{title:"useDragAndDrop",permalink:"/docs/core/content-manager/hooks/use-drag-and-drop"},next:{title:"Backend Design",permalink:"/docs/core/content-releases/backend"}},u={},p=[{value:"Architecture",id:"architecture",level:3}],d={toc:p};function m(e){let{components:t,...n}=e;return(0,o.kt)("wrapper",(0,r.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"content-releases"},"Content Releases"),(0,o.kt)("p",null,"A release contains various content entries, each capable of being assigned a specific action such as publish or unpublish. Within a release, entries may be in different locales or come from different content types. With a simple click of a button, a release can execute the designated action for each entry. Content Releases is an enterprise edition feature."),(0,o.kt)("h3",{id:"architecture"},"Architecture"),(0,o.kt)("p",null,"As opposed to other EE features built in the ",(0,o.kt)("a",{parentName:"p",href:"/docs/core/admin/ee/intro"},"EE folder"),", Releases is built as a plugin. The plugin can be found in:"),(0,o.kt)("pre",null,(0,o.kt)("code",{parentName:"pre"},"packages/core/content-releases\n")),(0,o.kt)(c.Z,{items:(0,a.jA)().items,mdxType:"DocCardList"}))}m.isMDXComponent=!0},3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var r=n(7294);function o(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function a(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){o(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,o=function(e,t){if(null==e)return{};var n,r,o={},c=Object.keys(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||(o[n]=e[n]);return o}(e,t);if(Object.getOwnPropertySymbols){var c=Object.getOwnPropertySymbols(e);for(r=0;r<c.length;r++)n=c[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(o[n]=e[n])}return o}var s=r.createContext({}),l=function(e){var t=r.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):a(a({},t),e)),n},u=function(e){var t=l(e.components);return r.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},d=r.forwardRef((function(e,t){var n=e.components,o=e.mdxType,c=e.originalType,s=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),d=l(n),m=o,f=d["".concat(s,".").concat(m)]||d[m]||p[m]||c;return n?r.createElement(f,a(a({ref:t},u),{},{components:n})):r.createElement(f,a({ref:t},u))}));function m(e,t){var n=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var c=n.length,a=new Array(c);a[0]=d;var i={};for(var s in t)hasOwnProperty.call(t,s)&&(i[s]=t[s]);i.originalType=e,i.mdxType="string"==typeof e?e:o,a[1]=i;for(var l=2;l<c;l++)a[l]=n[l];return r.createElement.apply(null,a)}return r.createElement.apply(null,n)}d.displayName="MDXCreateElement"}}]);