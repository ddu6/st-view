export interface TreeItem<Data> {
    level: number;
    data: Data;
}
export interface Tree<Data> {
    data: Data | undefined;
    children: Tree<Data>[];
}
export declare function createTree<Data>(data?: Data, array?: TreeItem<Data>[]): Tree<Data>;
