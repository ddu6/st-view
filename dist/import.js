import { createImporter } from '@ddu6/importer';
export const { getMod } = createImporter({
    stc: 'https://cdn.jsdelivr.net/gh/st-org/stc@0.28.0/mod.js',
    stui: 'https://cdn.jsdelivr.net/gh/st-org/stui@0.15.11/mod.js',
    ucs: 'https://cdn.jsdelivr.net/gh/st-org/st-std@0.31.3/ucs.js'
});
