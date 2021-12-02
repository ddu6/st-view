import {Viewer} from './mod.js'
const viewer=window.viewer=new Viewer()
document.head.append(viewer.headStyle)
document.head.append(viewer.styleEle)
document.head.append(viewer.customStyle)
document.body.append(viewer.element)