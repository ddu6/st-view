import {createViewer,init} from './mod.js'
init()
const viewer=window.viewer=await createViewer()
document.head.append(viewer.style)
document.body.append(viewer.element)
await viewer.autoLoad()