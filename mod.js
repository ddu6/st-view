var t={d:(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};function n(t,e=[]){const n={data:t,children:[]};for(const{level:t,data:o}of e){let e=n;for(let n=1;n<t;n++){const t=e.children;t.length>0?e=t[t.length-1]:(e={data:void 0,children:[]},t.push(e))}e.children.push({data:o,children:[]})}return n}function o(t,e){const o=[];for(const n of t.headings)o.push({level:n.index.length,data:{string:e(n.unit),href:`#${encodeURIComponent(n.id)}`}});return n({string:t.title,href:"#"},o)}function i(t){const e=document.createElement("details"),n=document.createElement("summary"),o=document.createElement("a");e.open=!0,void 0!==t.data&&(o.href=t.data.href,o.textContent=t.data.string),e.append(n),n.append(o);for(const n of t.children)e.append(i(n));return e}t.d(e,{f1:()=>n,i9:()=>c,dR:()=>o,ji:()=>i});const{getMod:s}=function(t){const e={},n=new EventTarget;for(const o in t)n.addEventListener(`load-${o}`,(async()=>{e[o]=await new Function(`return import(${JSON.stringify(t[o])})`)(),n.dispatchEvent(new Event(`loaded-${o}`))}),{once:!0});return{getMod:async function(t){const o=e[t];return void 0!==o?o:(n.dispatchEvent(new Event(`load-${t}`)),new Promise((o=>{n.addEventListener(`loaded-${t}`,(()=>{o(e[t])}))})))}}}({stc:"../stc@0.28.2/mod.js",stui:"../stui@0.15.12/mod.js",ucs:"../st-std@0.31.4/ucs.js"});async function c(){const{element:t,main:e,sideContent:n,article:c,settings:a}=(await s("stui")).createASStruct(),r=document.createElement("style"),l=document.createElement("nav");n.prepend(l);const d=[],u={};async function f(t,e,n,o){const{compiler:i}=u;if(void 0===i)return;let s;if(void 0!==e){i.urls.isRelURL(e)&&(e=new URL(e,t).href);const{origin:n,pathname:o}=new URL(e),{parts:c}=i.context;for(const t of c){const e=new URL(t.url);if(e.origin===n&&e.pathname===o){s=t;break}}}let a=c;if(void 0!==n){let t=0;void 0!==s&&(t=i.context.partToOffset.get(s)??0);const e=i.position.positionToUnitOrLines(i.position.parsePositionStr(n),i.context.stdn,t);for(let t=e.length-1;t>=0;t--){const n=i.unitOrLineToElements.get(e[t]);if(void 0!==n&&n.length>0){a=n[n.length-1];break}}}if(void 0!==o){const t=a.querySelector(`[id=${JSON.stringify(o)}]`);null!==t&&(a=t)}if(a!==c){let t=!1;const e=()=>{t=!0};addEventListener("click",e,{once:!0}),addEventListener("keydown",e,{once:!0}),addEventListener("touchmove",e,{once:!0}),addEventListener("wheel",e,{once:!0});for(let e=0;e<100&&!t;e++)Math.abs(a.getBoundingClientRect().top)>1&&a.scrollIntoView(),await new Promise((t=>setTimeout(t,100)))}}function m({compiler:t,documentFragment:e}){t.context.title.length>0&&(document.title=t.context.title),c.innerHTML="",c.append(e),l.innerHTML="",l.append(i(o(t.context,t.base.unitToInlinePlainString))),u.compiler=t}async function g(e){t.classList.add("loading");const{compileURLs:n}=await s("stc");m(await n(e,{builtInTagToUnitCompiler:await s("ucs"),style:r})),t.classList.remove("loading")}async function p(e,n){t.classList.add("loading");const{compile:o}=await s("stc");m(await o([{value:e,url:n}],{builtInTagToUnitCompiler:await s("ucs"),style:r})),t.classList.remove("loading")}return c.addEventListener("dblclick",(async t=>{const{compiler:e}=u;if(void 0!==e)for(const n of t.composedPath()){if(!(n instanceof HTMLElement||n instanceof SVGElement))continue;const t=e.elementToUnitOrLine.get(n);if(void 0===t)continue;const o=e.context.unitOrLineToPart.get(t);if(void 0===o)continue;const i=e.context.partToOffset.get(o);if(void 0===i)continue;const s=e.context.unitOrLineToPosition.get(t);if(void 0!==s){for(const t of d)await t(o,i,s);return}}})),{element:t,style:r,main:e,sideContent:n,article:c,nav:l,settings:a,dblClickLineListeners:d,env:u,focus:f,load:g,loadString:p,autoLoad:async function(){const{dataset:t}=document.documentElement,{srcPolicy:e}=t;let{src:n,string:o}=t;const i=new URL(".",new URL(n??"",location.href)).href,s=new URLSearchParams(location.search),c=s.get("src");if(null!==c){const t=new URL(c,i).href;("loose"===e||t.startsWith(i))&&(n=t)}const a=s.get("string");null!==a&&"loose"===e&&(o=a);const r=s.get("focus-url")??t.focusUrl,l=s.get("focus-position")??t.focusPosition;let d;d=location.hash.length>1?decodeURIComponent(location.hash.slice(1)):t.focusId,void 0!==o?await p(o,i):void 0!==n&&await g([n]),await f(i,r,l,d)}}}var a=e.f1,r=e.i9,l=e.dR,d=e.ji;export{a as createTree,r as createViewer,l as extractHeadingTree,d as headingTreeToElement};