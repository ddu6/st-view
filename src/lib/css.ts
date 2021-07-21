export const root=`.main>.article {
    padding: 0 var(--length-padding);
    margin: 0 auto;
    max-width: var(--length-width);
    min-width: 100px;
    margin-bottom: 100vh;
}

@media print {
    .main>.article {
        margin: 0;
        padding: 0;
    }
}

.side>.content {
    overflow: auto;
    justify-content: space-between;
}

.side>.content>.panel {
    padding: var(--length-padding);
}`
export const tree=`.heading-tree {
    padding: var(--length-padding);
}

.heading-tree .data {
    display: flex;
    align-items: baseline;
}

.heading-tree .mark::before {
    font-family: var(--font-mono);
    color: var(--color-light);
    display: block;
    width: 1em;
    text-align: center;
    content: "-";
}

.heading-tree .tree.folded>.data>.mark::before {
    content: "+";
}

.heading-tree .content {
    flex-grow: 1;
}

.heading-tree .children {
    margin-left: .5em;
    border-left: 1px solid var(--color-border);
}

.heading-tree .tree.folded>.children {
    display: none;
}`
export const all=root+tree