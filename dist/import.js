import { createImporter } from '@ddu6/importer';
export const { getMod } = createImporter({
    stc: 'https://cdn.jsdelivr.net/gh/st-org/stc@0.19.1/mod.js',
    stui: 'https://cdn.jsdelivr.net/gh/st-org/stui@0.11.2/mod.js',
    ucs: 'https://cdn.jsdelivr.net/gh/st-org/st-std@0.24.1/ucs.js'
});
