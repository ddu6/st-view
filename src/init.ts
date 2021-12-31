import {init as init0,InitOptions} from '@ddu6/stui'
import {css} from 'st-std'
import {all} from './lib/css'
export function init(options:InitOptions={}){
    init0({
        css:css+all,
        window:options.window
    })
}