import type { STDNPosition } from 'stdn';
import type { Compiler, STDNPart } from '@ddu6/stc';
export declare function createViewer(): Promise<{
    element: HTMLDivElement;
    style: HTMLStyleElement;
    main: HTMLElement;
    sideContent: HTMLDivElement;
    article: HTMLElement;
    nav: HTMLElement;
    settings: HTMLDetailsElement;
    dblClickLineListeners: ((part: STDNPart, offset: number, position: STDNPosition) => Promise<void>)[];
    env: {
        compiler?: Compiler | undefined;
    };
    focus: (focusURL?: string | undefined, focusPositionStr?: string | undefined, focusId?: string | undefined) => Promise<void>;
    load: (urls: string[]) => Promise<void>;
    loadString: (string: string) => Promise<void>;
    autoLoad: () => Promise<void>;
}>;
