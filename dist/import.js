import { createImporter } from '@ddu6/importer';
export const { getMod } = createImporter({
    stc: '../stc@0.28.6/mod.js',
    stui: '../stui@0.31.8/mod.js',
    ucs: '../st-std@0.31.10/ucs.js'
});
