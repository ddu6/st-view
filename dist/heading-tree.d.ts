import { Context } from '@ddu6/stc';
import { Div } from '@ddu6/stui';
import { Tree } from './tree';
export interface HeadingTreeItem {
    string: string;
    href: string;
}
export declare function extractHeadingTree(context: Context): Tree<{
    string: string;
    href: string;
}>;
export declare function headingTreeToElement(tree: Tree<HeadingTreeItem>): Div;
