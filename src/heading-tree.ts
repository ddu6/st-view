import type {Context, unitToInlinePlainString} from '@ddu6/stc'
import {createTree, Tree, TreeItem} from './tree'
export interface HeadingTreeItem {
    string: string
    href: string
}
export function extractHeadingTree(context: Context, unitToInlinePlainString0: typeof unitToInlinePlainString) {
    const array: TreeItem<HeadingTreeItem>[] = []
    for (const indexInfo of context.headings) {
        array.push({
            level: indexInfo.index.length,
            data: {
                string: unitToInlinePlainString0(indexInfo.unit),
                href: `#${encodeURIComponent(indexInfo.id)}`
            }
        })
    }
    return createTree({
        string: context.title,
        href: '#'
    }, array)
}
export function headingTreeToElement(tree: Tree<HeadingTreeItem>) {
    const details = document.createElement('details')
    const summary = document.createElement('summary')
    const a = document.createElement('a')
    details.open = true
    if (tree.data !== undefined) {
        a.href = tree.data.href
        a.textContent = tree.data.string
    }
    details.append(summary)
    summary.append(a)
    for (const child of tree.children) {
        details.append(headingTreeToElement(child))
    }
    return details
}