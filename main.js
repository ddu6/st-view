import {init} from 'https://cdn.jsdelivr.net/gh/st-org/stui@0.15.6/mod.js'
import {createViewer} from './mod.js'
init()
const style = document.createElement('style')
const viewer = window.viewer = await createViewer()
document.head.append(style)
document.head.append(viewer.style)
document.body.append(viewer.element)
style.textContent = `@import ${JSON.stringify(new URL('./main.css', import.meta.url).href)};`
await viewer.autoLoad()