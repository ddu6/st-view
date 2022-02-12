import { createImporter } from '@ddu6/importer';
export const { getMod } = createImporter({
    stc: 'https://cdn.jsdelivr.net/gh/st-org/stc@0.23.2/mod.js',
    stui: 'https://cdn.jsdelivr.net/gh/st-org/stui@0.15.6/mod.js',
    ucs: 'https://cdn.jsdelivr.net/gh/st-org/st-std@0.29.1/ucs.js'
});
