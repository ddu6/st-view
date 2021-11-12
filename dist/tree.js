export class Tree {
    constructor(data, array = []) {
        this.data = data;
        const tree = { data: data, children: [] };
        for (const { level, data } of array) {
            let pointer = tree;
            for (let i = 1; i < level; i++) {
                const children = pointer.children;
                if (children.length > 0) {
                    pointer = children[children.length - 1];
                }
                else {
                    pointer = {
                        data: undefined,
                        children: []
                    };
                    children.push(pointer);
                }
            }
            const children = pointer.children;
            children.push({
                data: data,
                children: []
            });
        }
        this.children = tree.children;
    }
}
