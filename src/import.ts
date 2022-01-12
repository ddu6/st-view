import {createImporter} from '@ddu6/importer'
import type * as stc from '@ddu6/stc'
import type * as stui from '@ddu6/stui'
import type {tagToUnitCompiler} from 'st-std'
export const {getMod} = createImporter<{
    stc: typeof stc
    stui: typeof stui
    ucs: typeof tagToUnitCompiler
}>({
    stc: 'https://cdn.jsdelivr.net/gh/st-org/stc@0.19.1/mod.js',
    stui: 'https://cdn.jsdelivr.net/gh/st-org/stui@0.11.0/mod.js',
    ucs: 'https://cdn.jsdelivr.net/gh/st-org/sthl@0.23.1/ucs.js'
})