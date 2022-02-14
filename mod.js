var t={d:(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};t.d(e,{mp:()=>n,i9:()=>c,dR:()=>o,ji:()=>i});class n{constructor(t,e=[]){this.data=t;const n={data:t,children:[]};for(const{level:t,data:o}of e){let e=n;for(let n=1;n<t;n++){const t=e.children;t.length>0?e=t[t.length-1]:(e={data:void 0,children:[]},t.push(e))}e.children.push({data:o,children:[]})}this.children=n.children}}function o(t,e){const o=[];for(const n of t.headings)o.push({level:n.index.length,data:{string:e(n.unit),href:`#${encodeURIComponent(n.id)}`}});return new n({string:t.title,href:"#"},o)}function i(t){const e=document.createElement("details"),n=document.createElement("summary"),o=document.createElement("a");e.open=!0,void 0!==t.data&&(o.href=t.data.href,o.textContent=t.data.string),e.append(n),n.append(o);for(const n of t.children)e.append(i(n));return e}const{getMod:s}=function(t){const e={},n=new EventTarget;for(const o in t)n.addEventListener(`load-${o}`,(async()=>{e[o]=await new Function(`return import(${JSON.stringify(t[o])})`)(),n.dispatchEvent(new Event(`loaded-${o}`))}),{once:!0});return{getMod:async function(t){const o=e[t];return void 0!==o?o:(n.dispatchEvent(new Event(`load-${t}`)),new Promise((o=>{n.addEventListener(`loaded-${t}`,(()=>{o(e[t])}))})))}}}({stc:"https://cdn.jsdelivr.net/gh/st-org/stc@0.26.1/mod.js",stui:"https://cdn.jsdelivr.net/gh/st-org/stui@0.15.9/mod.js",ucs:"https://cdn.jsdelivr.net/gh/st-org/st-std@0.31.1/ucs.js"});async function c(){const{element:t,main:e,sideContent:n,article:c,settings:a}=(await s("stui")).createASStruct(),r=document.createElement("style"),d=document.createElement("nav");n.prepend(d);const l=[],u={};async function m(t,e,n){const{compiler:o}=u;if(void 0===o)return;let i;if(void 0!==t){o.urls.isRelURL(t)&&(t=new URL(t,location.href).href);const{origin:e,pathname:n}=new URL(t),{parts:s}=o.context;for(const t of s){const o=new URL(t.url);if(o.origin===e&&o.pathname===n){i=t;break}}}let s=c;if(void 0!==e){let t=0;void 0!==i&&(t=o.context.partToOffset.get(i)??0);const n=o.position.positionToUnitOrLines(o.position.parsePositionStr(e),o.context.stdn,t);for(let t=n.length-1;t>=0;t--){const e=o.unitOrLineToElements.get(n[t]);if(void 0!==e&&e.length>0){s=e[e.length-1];break}}}if(void 0!==n){const t=s.querySelector(`[id=${JSON.stringify(n)}]`);null!==t&&(s=t)}if(s!==c){let t=!1;const e=()=>{t=!0};addEventListener("click",e,{once:!0}),addEventListener("keydown",e,{once:!0}),addEventListener("touchmove",e,{once:!0}),addEventListener("wheel",e,{once:!0});for(let e=0;e<100&&!t;e++)Math.abs(s.getBoundingClientRect().top)>1&&s.scrollIntoView(),await new Promise((t=>setTimeout(t,100)))}}function f({compiler:t,documentFragment:e}){document.title=t.context.title,c.innerHTML="",c.append(e),d.innerHTML="",d.append(i(o(t.context,t.base.unitToInlinePlainString))),u.compiler=t}async function g(e){t.classList.add("loading");const{compileURLs:n}=await s("stc");f(await n(e,{builtInTagToUnitCompiler:await s("ucs"),style:r})),t.classList.remove("loading")}async function p(e){t.classList.add("loading");const{compile:n}=await s("stc");f(await n([{value:e,url:location.href}],{builtInTagToUnitCompiler:await s("ucs"),style:r})),t.classList.remove("loading")}return c.addEventListener("dblclick",(async t=>{const{compiler:e}=u;if(void 0!==e)for(const n of t.composedPath()){if(!(n instanceof HTMLElement||n instanceof SVGElement))continue;const t=e.elementToUnitOrLine.get(n);if(void 0===t)continue;const o=e.context.unitOrLineToPart.get(t);if(void 0===o)continue;const i=e.context.partToOffset.get(o);if(void 0===i)continue;const s=e.context.unitOrLineToPosition.get(t);if(void 0!==s){for(const t of l)await t(o,i,s);return}}})),{element:t,style:r,main:e,sideContent:n,article:c,nav:d,settings:a,dblClickLineListeners:l,env:u,focus:m,load:g,loadString:p,autoLoad:async function(){const t=new URLSearchParams(location.search),e=t.get("focus-url")??document.documentElement.dataset.focusUrl,n=t.get("focus-position")??document.documentElement.dataset.focusPosition;let o;o=location.hash.length>1?decodeURIComponent(location.hash.slice(1)):document.documentElement.dataset.focusId;const i=t.get("string")??document.documentElement.dataset.string,s=t.get("src")??document.documentElement.dataset.src;void 0!==i?await p(i):void 0!==s&&await g([s]),await m(e,n,o)}}}var a=e.mp,r=e.i9,d=e.dR,l=e.ji;export{a as Tree,r as createViewer,d as extractHeadingTree,l as headingTreeToElement};