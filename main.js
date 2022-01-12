import {init} from 'https://cdn.jsdelivr.net/gh/st-org/stui@0.11.0/mod.js'
import {createViewer} from './mod.js'
init()
const style = document.createElement('style')
style.textContent = `@import url(https://cdn.jsdelivr.net/gh/st-org/st-std@0.23.0/mod.js);`
document.head.append(style)
const viewer = window.viewer = await createViewer()
document.head.append(viewer.style)
document.body.append(viewer.element)
await viewer.autoLoad()