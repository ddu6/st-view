export const root="main>article {\n    display: flow-root;\n    margin: 0 auto;\n    margin-bottom: 100vh;\n    max-width: var(--length-width);\n    min-width: 100px;\n    padding: 0 var(--length-padding);\n}\n\n@media print {\n    main>article {\n        margin: 0;\n        padding: 0;\n    }\n}\n\naside>.content {\n    display: flex;\n    flex-direction: column;\n    height: 100%;\n    justify-content: space-between;\n    overflow: auto;\n}\n\naside>.content>.panel {\n    margin: var(--length-padding);\n}"
export const tree=".heading-tree {\n    margin: var(--length-padding);\n}\n\n.heading-tree .data {\n    display: flex;\n    align-items: baseline;\n}\n\n.heading-tree .mark::before {\n    font-family: var(--font-mono);\n    color: var(--color-light);\n    display: block;\n    width: 1em;\n    text-align: center;\n    content: \"−\";\n}\n\n.heading-tree .tree.folded>.data>.mark::before {\n    content: \"+\";\n}\n\n.heading-tree .content {\n    flex-grow: 1;\n}\n\n.heading-tree .children {\n    border-left: 1px solid var(--color-border);\n    margin-left: calc(.5em - .5px);\n}\n\n.heading-tree .tree.folded>.children {\n    display: none;\n}"
export const all=root+tree