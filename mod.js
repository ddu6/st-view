var t={d:(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};t.d(e,{mp:()=>n,i9:()=>c,dR:()=>o,ji:()=>i});class n{constructor(t,e=[]){this.data=t;const n={data:t,children:[]};for(const{level:t,data:o}of e){let e=n;for(let n=1;n<t;n++){const t=e.children;t.length>0?e=t[t.length-1]:(e={data:void 0,children:[]},t.push(e))}e.children.push({data:o,children:[]})}this.children=n.children}}function o(t,e){const o=[];for(const n of t.indexInfoArray)"heading"===n.orbit&&o.push({level:n.index.length,data:{string:e(n.unit),href:"#"+encodeURIComponent(n.id)}});return new n({string:t.title,href:"#"},o)}function i(t){const e=document.createElement("details"),n=document.createElement("summary"),o=document.createElement("a");e.open=!0,void 0!==t.data&&(o.href=t.data.href,o.textContent=t.data.string),e.append(n),n.append(o);for(const n of t.children)e.append(i(n));return e}const{getMod:a}=function(t){const e={},n=new EventTarget;for(const o of Object.keys(t))n.addEventListener(`load-${o}`,(async()=>{e[o]=await new Function(`return import(${JSON.stringify(t[o])})`)(),n.dispatchEvent(new Event(`loaded-${o}`))}),{once:!0});return{getMod:async function(t){const o=e[t];return void 0!==o?o:(n.dispatchEvent(new Event(`load-${t}`)),new Promise((o=>{n.addEventListener(`loaded-${t}`,(()=>{o(e[t])}))})))}}}({stc:"https://cdn.jsdelivr.net/gh/st-org/stc@0.19.1/mod.js",stui:"https://cdn.jsdelivr.net/gh/st-org/stui@0.12.0/mod.js",ucs:"https://cdn.jsdelivr.net/gh/st-org/st-std@0.24.2/ucs.js"});async function c(){const{element:t,main:e,sideContent:n,article:c,settings:s}=(await a("stui")).createASStruct(),r=document.createElement("style"),d=document.createElement("nav");n.prepend(d);const l=[],u={};async function m({compiler:t,parts:e,partLengths:n,focusURL:o,focusLine:i,focusId:a}){if(0===e.length||0===c.children.length)return;let s=0;for(let t=0;t<n.length;t++){const o=n[t],{dir:i}=e[t];for(let t=0;t<o;t++){const e=c.children[s],n=s;e.addEventListener("dblclick",(async()=>{for(const e of l)await e(n,i,t)})),s++}}let r=0;if(void 0!==o){t.urls.isRelURL(o)&&(o=new URL(o,location.href).href);const{origin:n,pathname:i}=new URL(o);for(let t=0;t<e.length;t++){const o=new URL(e[t].dir);if(o.origin===n&&o.pathname===i){r=t;break}}}let d=c;if(void 0!==i){for(let t=0;t<r;t++)i+=n[t];i<0?i=0:i>=c.children.length&&(i=c.children.length-1);const t=c.children[i];void 0!==t&&(d=t)}if(void 0!==a){const t=d.querySelector(`[id=${JSON.stringify(a)}]`);null!==t&&(d=t)}if(d!==c){let t=!1;const e=()=>{t=!0};addEventListener("wheel",e,{once:!0}),addEventListener("touchmove",e,{once:!0}),addEventListener("keydown",e,{once:!0}),addEventListener("click",e,{once:!0});for(let e=0;e<100&&!t;e++)Math.abs(d.getBoundingClientRect().top)>1&&d.scrollIntoView(),await new Promise((t=>setTimeout(t,100)))}}async function h(t,e,n,s){const{multiCompile:l,urlsToAbsURLs:h}=await a("stc"),f=[];for(const e of await h(t,location.href))f.push((async()=>{try{const t=await fetch(e);return t.ok?[{string:await t.text(),dir:e}]:[]}catch(t){return console.log(t),[]}})());const g=(await Promise.all(f)).flat(),{compiler:p,documentFragment:v,partLengths:w,stdn:L}=await l(g,{builtInTagToUnitCompiler:await a("ucs"),style:r});document.title=p.context.title,c.innerHTML="",c.append(v),d.innerHTML="",d.append(i(o(p.context,p.base.unitToInlinePlainString))),await m(u.content={compiler:p,documentFragment:v,parts:g,partLengths:w,stdn:L,focusURL:e,focusLine:n,focusId:s})}async function f(t,e,n){const{compile:s}=await a("stc"),l=await s(t,location.href,{builtInTagToUnitCompiler:await a("ucs"),style:r});if(void 0===l)return;const{compiler:h,documentFragment:f,stdn:g}=l;document.title=h.context.title,c.innerHTML="",c.append(f),d.innerHTML="",d.append(i(o(h.context,h.base.unitToInlinePlainString))),await m(u.content={compiler:h,documentFragment:f,parts:[{string:t,dir:location.href}],partLengths:[g.length],stdn:g,focusURL:void 0,focusLine:e,focusId:n})}return{element:t,style:r,main:e,sideContent:n,article:c,nav:d,settings:s,dblClickLineListeners:l,env:u,initParts:m,load:h,loadString:f,autoLoad:async function(){const t=new URLSearchParams(location.search),e=t.get("focus-url")??document.documentElement.dataset.focusUrl,n=t.get("focus-line")??document.documentElement.dataset.focusLine;let o,i;void 0!==n&&(o=Number(n),isFinite(o)&&o%1==0||(o=void 0)),i=location.hash.length>1?decodeURIComponent(location.hash.slice(1)):document.documentElement.dataset.focusId;const a=t.get("string")??document.documentElement.dataset.string,c=t.get("src")??document.documentElement.dataset.src;void 0===a?void 0!==c&&await h([c],e,o,i):await f(a,o,i)}}}var s=e.mp,r=e.i9,d=e.dR,l=e.ji;export{s as Tree,r as createViewer,d as extractHeadingTree,l as headingTreeToElement};