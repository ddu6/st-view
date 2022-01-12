import { Tree } from './tree';
export function extractHeadingTree(context, unitToInlinePlainString0) {
    const array = [];
    for (const indexInfo of context.indexInfoArray) {
        if (indexInfo.orbit === 'heading') {
            array.push({
                level: indexInfo.index.length,
                data: {
                    string: unitToInlinePlainString0(indexInfo.unit),
                    href: '#' + encodeURIComponent(indexInfo.id)
                }
            });
        }
    }
    return new Tree({
        string: context.title,
        href: '#'
    }, array);
}
export function headingTreeToElement(tree) {
    const details = document.createElement('details');
    const summary = document.createElement('summary');
    const a = document.createElement('a');
    details.open = true;
    if (tree.data !== undefined) {
        a.href = tree.data.href;
        a.textContent = tree.data.string;
    }
    details.append(summary);
    summary.append(a);
    for (const child of tree.children) {
        details.append(headingTreeToElement(child));
    }
    return details;
}
