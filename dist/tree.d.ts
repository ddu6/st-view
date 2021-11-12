export interface TreeItem<Data> {
    level: number;
    data: Data;
}
export declare type TreeItems<Data> = TreeItem<Data>[];
export declare class Tree<Data> {
    data: Data | undefined;
    children: Tree<Data>[];
    constructor(data?: Data, array?: TreeItems<Data>);
}
