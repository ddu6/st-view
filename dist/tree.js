export function createTree(data, array = []) {
    const tree = { data, children: [] };
    for (const { level, data } of array) {
        let pointer = tree;
        for (let i = 1; i < level; i++) {
            const children = pointer.children;
            if (children.length > 0) {
                pointer = children[children.length - 1];
                continue;
            }
            pointer = {
                data: undefined,
                children: []
            };
            children.push(pointer);
        }
        pointer.children.push({
            data: data,
            children: []
        });
    }
    return tree;
}
