import type * as stc from '@ddu6/stc';
import type * as stui from '@ddu6/stui';
import type { tagToUnitCompiler } from 'st-std';
export declare const getMod: <T extends "stc" | "stui" | "ucs">(name: T) => Promise<{
    stc: typeof stc;
    stui: typeof stui;
    ucs: typeof tagToUnitCompiler;
}[T]>;
