import { Checkbox, CommonEle, Form, LRStruct } from '@ddu6/stui';
export declare class Viewer extends LRStruct {
    readonly headStyle: HTMLStyleElement;
    readonly customStyle: HTMLStyleElement;
    readonly article: CommonEle<"article">;
    readonly headingTree: CommonEle<"nav">;
    readonly selects: {
        colorScheme: HTMLSelectElement;
        fontSize: HTMLSelectElement;
    };
    readonly checkboxes: {
        settings: Checkbox;
    };
    readonly forms: {
        panel: Form;
        settings: Form;
    };
    dblClickLineListeners: ((line: number, url: string, partialLine: number) => Promise<void>)[];
    constructor();
    private initParts;
    load(urls: string[], focusURL?: string, focusLine?: number, focusId?: string): Promise<void>;
    loadString(string: string, focusLine?: number, focusId?: string): Promise<void>;
}
