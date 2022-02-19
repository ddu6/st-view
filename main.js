import {init} from 'https://cdn.jsdelivr.net/gh/st-org/stui@0.15.9/mod.js'
import {createViewer} from './mod.js'
init()
const style = document.createElement('style')
document.head.append(style)
style.textContent = `@import ${JSON.stringify(new URL('./main.css', import.meta.url).href)};`
const viewer = window.viewer = await createViewer()
document.head.append(viewer.style)
document.body.append(viewer.element)
await viewer.autoLoad()