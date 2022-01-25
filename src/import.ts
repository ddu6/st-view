import {createImporter} from '@ddu6/importer'
import type * as stc from '@ddu6/stc'
import type * as stui from '@ddu6/stui'
import type {tagToUnitCompiler} from 'st-std'
export const {getMod} = createImporter<{
    stc: typeof stc
    stui: typeof stui
    ucs: typeof tagToUnitCompiler
}>({
    stc: 'https://cdn.jsdelivr.net/gh/st-org/stc@0.22.0/mod.js',
    stui: 'https://cdn.jsdelivr.net/gh/st-org/stui@0.15.5/mod.js',
    ucs: 'https://cdn.jsdelivr.net/gh/st-org/st-std@0.28.3/ucs.js'
})