import { STDN } from 'stdn';
import { Compiler } from '@ddu6/stc';
interface Part {
    string: string;
    dir: string;
}
export declare function createNamedElement(name: string, element: Element): HTMLDivElement;
export declare function createViewer(): Promise<{
    element: HTMLDivElement;
    style: HTMLStyleElement;
    main: HTMLElement;
    sideContent: HTMLDivElement;
    article: HTMLElement;
    nav: HTMLElement;
    panel: HTMLDivElement;
    settings: HTMLDivElement;
    content: {
        compiler?: Compiler | undefined;
        doc?: STDN | undefined;
        partLengths?: number[] | undefined;
    };
    dblClickLineListeners: ((line: number, url: string, partialLine: number) => Promise<void>)[];
    initParts: (parts: Part[], partLengths: number[], focusURL: string, focusLine: number, focusId: string) => Promise<void>;
    load: (urls: string[], focusURL?: string, focusLine?: number, focusId?: string) => Promise<void>;
    loadString: (string: string, focusLine?: number, focusId?: string) => Promise<void>;
    autoLoad: () => Promise<void>;
}>;
export {};
