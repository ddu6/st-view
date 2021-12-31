import { unitToInlinePlainString } from '@ddu6/stc';
import { Tree } from './tree';
export function extractHeadingTree(context) {
    const array = [];
    for (const indexInfo of context.indexInfoArray) {
        if (indexInfo.orbit === 'heading') {
            array.push({
                level: indexInfo.index.length,
                data: {
                    string: unitToInlinePlainString(indexInfo.unit),
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
export function headingTreeToElement(tree, document) {
    const element = document.createElement('div');
    const data = document.createElement('div');
    const children = document.createElement('div');
    const mark = document.createElement('div');
    const content = document.createElement('a');
    element.classList.add('tree');
    data.classList.add('data');
    children.classList.add('children');
    mark.classList.add('mark');
    content.classList.add('content');
    if (tree.data !== undefined) {
        content.href = tree.data.href;
        content.textContent = tree.data.string;
    }
    element.append(data);
    element.append(children);
    data.append(mark);
    data.append(content);
    for (const child of tree.children) {
        children.append(headingTreeToElement(child, document));
    }
    mark.addEventListener('click', () => {
        element.classList.toggle('folded');
    });
    return element;
}
