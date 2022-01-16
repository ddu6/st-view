import {init} from 'https://cdn.jsdelivr.net/gh/st-org/stui@0.15.2/mod.js'
import {createViewer} from './mod.js'
init()
const viewer = window.viewer = await createViewer()
document.head.append(viewer.style)
document.body.append(viewer.element)
await viewer.autoLoad()