import {Viewer} from './mod.js'
const viewer=window.viewer=new Viewer()
document.body.append(viewer.headStyle)
document.body.append(viewer.styleEle)
document.body.append(viewer.customStyle)
document.body.append(viewer.element)