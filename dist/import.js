import { createImporter } from '@ddu6/importer';
export const { getMod } = createImporter({
    stc: 'https://cdn.jsdelivr.net/gh/st-org/stc@0.28.6/mod.js',
    stui: 'https://cdn.jsdelivr.net/gh/st-org/stui@0.31.8/mod.js',
    ucs: 'https://cdn.jsdelivr.net/gh/st-org/st-std@0.31.10/ucs.js'
});
