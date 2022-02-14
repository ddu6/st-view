export interface TreeItem<Data> {
    level: number
    data: Data
}
export interface Tree<Data> {
    data: Data | undefined
    children: Tree<Data>[]
}
export function createTree<Data>(data?: Data, array: TreeItem<Data>[] = []) {
    const tree: Tree<Data> = {data, children: []}
    for (const {level, data} of array) {
        let pointer = tree
        for (let i = 1; i < level; i++) {
            const children = pointer.children
            if (children.length > 0) {
                pointer = children[children.length - 1]
                continue
            }
            pointer = {
                data: undefined,
                children: []
            }
            children.push(pointer)
        }
        pointer.children.push({
            data: data,
            children: []
        })
    }
    return tree
}