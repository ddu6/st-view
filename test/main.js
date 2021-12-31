import {createViewer,init} from '../mod.js'
import '../main.js'
const window=open('blank.html?src=main.urls&focus-url=main.stdn&focus-line=2#flt')
window.addEventListener('load',async ()=>{
    init({window})
    const viewer=window.viewer=createViewer({window})
    window.document.head.append(viewer.style)
    window.document.body.append(viewer.element)
    viewer.dblClickLineListeners.push((line,url,partialLine)=>{
        console.log(line,url,partialLine)
    })
    await viewer.autoLoad()
})