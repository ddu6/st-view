import type { multiCompile, STDNPart } from '@ddu6/stc';
export interface ViewerContent extends Awaited<ReturnType<typeof multiCompile>> {
    parts: STDNPart[];
    focusURL: string | undefined;
    focusLine: number | undefined;
    focusId: string | undefined;
}
export declare function createViewer(): Promise<{
    element: HTMLDivElement;
    style: HTMLStyleElement;
    main: HTMLElement;
    sideContent: HTMLDivElement;
    article: HTMLElement;
    nav: HTMLElement;
    settings: HTMLDetailsElement;
    dblClickLineListeners: ((line: number, url: string, partialLine: number) => Promise<void>)[];
    env: {
        content?: ViewerContent | undefined;
    };
    initParts: ({ compiler, parts, partLengths, focusURL, focusLine, focusId }: ViewerContent) => Promise<void>;
    load: (urls: string[], focusURL?: string | undefined, focusLine?: number | undefined, focusId?: string | undefined) => Promise<void>;
    loadString: (string: string, focusLine?: number | undefined, focusId?: string | undefined) => Promise<void>;
    autoLoad: () => Promise<void>;
}>;
