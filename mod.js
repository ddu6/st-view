var t={d:(e,n)=>{for(var o in n)t.o(n,o)&&!t.o(e,o)&&Object.defineProperty(e,o,{enumerable:!0,get:n[o]})},o:(t,e)=>Object.prototype.hasOwnProperty.call(t,e)},e={};function n(t,e=[]){const n={data:t,children:[]};for(const{level:t,data:o}of e){let e=n;for(let n=1;n<t;n++){const t=e.children;t.length>0?e=t[t.length-1]:(e={data:void 0,children:[]},t.push(e))}e.children.push({data:o,children:[]})}return n}function o(t,e){const o=[];for(const n of t.headings)o.push({level:n.index.length,data:{string:e(n.unit),href:`#${encodeURIComponent(n.id)}`}});return n({string:t.title,href:"#"},o)}function i(t){const e=document.createElement("details"),n=document.createElement("summary"),o=document.createElement("a");e.open=!0,void 0!==t.data&&(o.href=t.data.href,o.textContent=t.data.string),e.append(n),n.append(o);for(const n of t.children)e.append(i(n));return e}t.d(e,{f1:()=>n,i9:()=>s,dR:()=>o,ji:()=>i});const{getMod:c}=function(t){const e={},n=new EventTarget;for(const o in t)n.addEventListener(`load-${o}`,(async()=>{e[o]=await new Function(`return import(${JSON.stringify(t[o])})`)(),n.dispatchEvent(new Event(`loaded-${o}`))}),{once:!0});return{getMod:async function(t){const o=e[t];return void 0!==o?o:(n.dispatchEvent(new Event(`load-${t}`)),new Promise((o=>{n.addEventListener(`loaded-${t}`,(()=>{o(e[t])}))})))}}}({stc:"../stc@0.28.6/mod.js",stui:"../stui@0.31.8/mod.js",ucs:"../st-std@0.31.10/ucs.js"});var r=function(t,e,n,o){return new(n||(n=Promise))((function(i,c){function r(t){try{d(o.next(t))}catch(t){c(t)}}function s(t){try{d(o.throw(t))}catch(t){c(t)}}function d(t){var e;t.done?i(t.value):(e=t.value,e instanceof n?e:new n((function(t){t(e)}))).then(r,s)}d((o=o.apply(t,e||[])).next())}))};function s(){return r(this,void 0,void 0,(function*(){const{element:t,main:e,sideContent:n,article:s,settings:d}=(yield c("stui")).createASStruct(),l=document.createElement("style"),a=document.createElement("nav");n.prepend(a);const u=[],f={};function v(t,e,n,o){var i;return r(this,void 0,void 0,(function*(){const{compiler:c}=f;if(void 0===c)return;let r;if(void 0!==e){c.urls.isRelURL(e)&&(e=new URL(e,t).href);const{origin:n,pathname:o}=new URL(e),{parts:i}=c.context;for(const t of i){const e=new URL(t.url);if(e.origin===n&&e.pathname===o){r=t;break}}}let d=s;if(void 0!==n){let t=0;void 0!==r&&(t=null!==(i=c.context.partToOffset.get(r))&&void 0!==i?i:0);const e=c.position.positionToUnitOrLines(c.position.parsePositionStr(n),c.context.stdn,t);for(let t=e.length-1;t>=0;t--){const n=c.unitOrLineToElements.get(e[t]);if(void 0!==n&&n.length>0){d=n[n.length-1];break}}}if(void 0!==o){const t=d.querySelector(`[id=${JSON.stringify(o)}]`);null!==t&&(d=t)}if(d!==s){let t=!1;const e=()=>{t=!0};addEventListener("click",e,{once:!0}),addEventListener("keydown",e,{once:!0}),addEventListener("touchmove",e,{once:!0}),addEventListener("wheel",e,{once:!0}),addEventListener("popstate",e,{once:!0});for(let e=0;e<100&&!t;e++)Math.abs(d.getBoundingClientRect().top)>1&&d.scrollIntoView(),yield new Promise((t=>setTimeout(t,100)))}}))}function h({compiler:t,documentFragment:e}){return!t.stop&&(t.context.title.length>0&&(document.title=t.context.title),s.innerHTML="",s.append(e),a.innerHTML="",a.append(i(o(t.context,t.base.unitToInlinePlainString))),f.compiler=t,!0)}function m(e){return r(this,void 0,void 0,(function*(){t.classList.add("loading");const{compileURLs:n}=yield c("stc"),o=h(yield n(e,{builtInTagToUnitCompiler:yield c("ucs"),style:l}));return t.classList.remove("loading"),o}))}function p(e,n){return r(this,void 0,void 0,(function*(){t.classList.add("loading");const{compile:o}=yield c("stc"),i=h(yield o([{value:e,url:n}],{builtInTagToUnitCompiler:yield c("ucs"),style:l}));return t.classList.remove("loading"),i}))}return s.addEventListener("dblclick",(t=>r(this,void 0,void 0,(function*(){const{compiler:e}=f;if(void 0!==e)for(const n of t.composedPath()){if(!(n instanceof HTMLElement||n instanceof SVGElement))continue;const t=e.elementToUnitOrLine.get(n);if(void 0===t)continue;const o=e.context.unitOrLineToPart.get(t);if(void 0===o)continue;const i=e.context.partToOffset.get(o);if(void 0===i)continue;const c=e.context.unitOrLineToPosition.get(t);if(void 0!==c){for(const t of u)yield t(o,i,c);return}}})))),{element:t,style:l,main:e,sideContent:n,article:s,nav:a,settings:d,dblClickLineListeners:u,env:f,focus:v,load:m,loadString:p,autoLoad:function(){var t,e;return r(this,void 0,void 0,(function*(){const{dataset:n}=document.documentElement,{srcPolicy:o}=n;let{src:i,string:c}=n;const r=new URL(".",new URL(null!=i?i:"",location.href)).href,s=new URLSearchParams(location.search),d=s.get("src");if(null!==d){const t=new URL(d,r).href;("loose"===o||t.startsWith(r))&&(i=t)}const l=s.get("string");null!==l&&"loose"===o&&(c=l);const a=null!==(t=s.get("focus-url"))&&void 0!==t?t:n.focusUrl,u=null!==(e=s.get("focus-position"))&&void 0!==e?e:n.focusPosition;let f;if(f=location.hash.length>1?decodeURIComponent(location.hash.slice(1)):n.focusId,void 0!==c){if(!(yield p(c,r)))return}else if(void 0!==i&&!(yield m([i])))return;yield v(r,a,u,f)}))}}}))}var d=e.f1,l=e.i9,a=e.dR,u=e.ji;export{d as createTree,l as createViewer,a as extractHeadingTree,u as headingTreeToElement};