import {init as init0} from '@ddu6/stui'
import {css} from 'st-std'
import {all} from './lib/css'
export function init() {
    init0({
        css: css + all,
    })
}