import {createImporter} from '@ddu6/importer'
import type * as stc from '@ddu6/stc'
import type * as stui from '@ddu6/stui'
import type {tagToUnitCompiler} from 'st-std'
export const {getMod} = createImporter<{
    stc: typeof stc
    stui: typeof stui
    ucs: typeof tagToUnitCompiler
}>({
    stc: '../stc@0.28.6/mod.js',
    stui: '../stui@0.31.8/mod.js',
    ucs: '../st-std@0.31.9/ucs.js'
})