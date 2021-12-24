import { unitToInlinePlainString } from '@ddu6/stc';
import { Anchor, Div } from '@ddu6/stui';
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
export function headingTreeToElement(tree) {
    const mark = new Div(['mark']);
    const content = new Anchor((tree.data ?? {}).href ?? '', ['content'], '')
        .setText((tree.data ?? {}).string ?? '');
    const data = new Div(['data'])
        .append(mark)
        .append(content);
    const children = new Div(['children']);
    const element = new Div(['tree'])
        .append(data)
        .append(children);
    for (const child of tree.children) {
        children.append(headingTreeToElement(child));
    }
    mark.addEventListener('click', () => {
        element.classList.toggle('folded');
    });
    return element;
}
