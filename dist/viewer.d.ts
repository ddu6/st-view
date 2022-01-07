interface Part {
    string: string;
    dir: string;
}
export declare function createNamedElement(name: string, element: Element): HTMLDivElement;
export declare function createViewer(): {
    element: HTMLDivElement;
    style: HTMLStyleElement;
    main: HTMLElement;
    sideContent: HTMLDivElement;
    article: HTMLElement;
    nav: HTMLElement;
    panel: HTMLDivElement;
    settings: HTMLDetailsElement;
    dblClickLineListeners: ((line: number, url: string, partialLine: number) => Promise<void>)[];
    initParts: (parts: Part[], partLengths: number[], focusURL: string | undefined, focusLine: number | undefined, focusId: string | undefined) => Promise<void>;
    load: (urls: string[], focusURL?: string | undefined, focusLine?: number | undefined, focusId?: string | undefined) => Promise<void>;
    loadString: (string: string, focusLine?: number | undefined, focusId?: string | undefined) => Promise<void>;
    autoLoad: () => Promise<void>;
};
export {};
