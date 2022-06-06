import { createImporter } from '@ddu6/importer';
export const { getMod } = createImporter({
    stc: '../stc@0.28.3/mod.js',
    stui: '../stui@0.15.12/mod.js',
    ucs: '../st-std@0.31.4/ucs.js'
});
