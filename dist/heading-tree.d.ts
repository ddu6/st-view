import type { Context, unitToInlinePlainString } from '@ddu6/stc';
import { Tree } from './tree';
export interface HeadingTreeItem {
    string: string;
    href: string;
}
export declare function extractHeadingTree(context: Context, unitToInlinePlainString0: typeof unitToInlinePlainString): Tree<{
    string: string;
    href: string;
}>;
export declare function headingTreeToElement(tree: Tree<HeadingTreeItem>): HTMLDetailsElement;
