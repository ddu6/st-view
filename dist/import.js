import { createImporter } from '@ddu6/importer';
export const { getMod } = createImporter({
    stc: '../stc@0.28.5/mod.js',
    stui: '../stui@0.15.12/mod.js',
    ucs: '../st-std@0.31.5/ucs.js'
});
