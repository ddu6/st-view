import { compile, isRelURL, multiCompile, urlsToAbsURLs } from '@ddu6/stc';
import { tagToUnitCompiler } from 'st-std';
import { createASStruct } from '@ddu6/stui';
import { extractHeadingTree, headingTreeToElement } from './heading-tree';
export function createViewer() {
    const { element, main, sideContent, article, panel, settings } = createASStruct();
    const style = document.createElement('style');
    const nav = document.createElement('nav');
    sideContent.prepend(nav);
    const dblClickLineListeners = [];
    async function initParts(parts, partLengths, focusURL, focusLine, focusId) {
        if (parts.length === 0 || article.children.length === 0) {
            return;
        }
        let line = 0;
        for (let i = 0; i < partLengths.length; i++) {
            const partLength = partLengths[i];
            const { dir } = parts[i];
            for (let partialLine = 0; partialLine < partLength; partialLine++) {
                const lineEle = article.children[line];
                const staticLine = line;
                lineEle.addEventListener('dblclick', async () => {
                    for (const listener of dblClickLineListeners) {
                        await listener(staticLine, dir, partialLine);
                    }
                });
                line++;
            }
        }
        let focusPart = 0;
        if (focusURL !== undefined) {
            if (isRelURL(focusURL)) {
                focusURL = new URL(focusURL, location.href).href;
            }
            const { origin, pathname } = new URL(focusURL);
            for (let i = 0; i < parts.length; i++) {
                const url = new URL(parts[i].dir);
                if (url.origin === origin && url.pathname === pathname) {
                    focusPart = i;
                    break;
                }
            }
        }
        let focusEle = article;
        if (focusLine !== undefined) {
            for (let i = 0; i < focusPart; i++) {
                focusLine += partLengths[i];
            }
            if (focusLine < 0) {
                focusLine = 0;
            }
            else if (focusLine >= article.children.length) {
                focusLine = article.children.length - 1;
            }
            const div = article.children[focusLine];
            if (div !== undefined) {
                focusEle = div;
            }
        }
        if (focusId !== undefined) {
            const anchor = focusEle.querySelector(`[id=${JSON.stringify(focusId)}]`);
            if (anchor !== null) {
                focusEle = anchor;
            }
        }
        if (focusEle !== article) {
            let operated = false;
            const l = () => {
                operated = true;
            };
            addEventListener('wheel', l, { once: true });
            addEventListener('touchmove', l, { once: true });
            addEventListener('keydown', l, { once: true });
            addEventListener('click', l, { once: true });
            for (let i = 0; i < 100; i++) {
                if (operated) {
                    break;
                }
                if (Math.abs(focusEle.getBoundingClientRect().top) > 1) {
                    focusEle.scrollIntoView();
                }
                await new Promise(r => setTimeout(r, 100));
            }
        }
    }
    async function load(urls, focusURL, focusLine, focusId) {
        const partPromises = [];
        for (const url of await urlsToAbsURLs(urls, location.href)) {
            partPromises.push((async () => {
                try {
                    const res = await fetch(url);
                    if (!res.ok) {
                        return [];
                    }
                    return [{
                            string: await res.text(),
                            dir: url
                        }];
                }
                catch (err) {
                    console.log(err);
                    return [];
                }
            })());
        }
        const parts = (await Promise.all(partPromises)).flat();
        const result = await multiCompile(parts, {
            builtInTagToUnitCompiler: tagToUnitCompiler,
            style
        });
        document.title = result.compiler.context.title;
        article.innerHTML = '';
        article.append(result.documentFragment);
        nav.innerHTML = '';
        nav.append(headingTreeToElement(extractHeadingTree(result.compiler.context)));
        await initParts(parts, result.partLengths, focusURL, focusLine, focusId);
    }
    async function loadString(string, focusLine, focusId) {
        const result = await compile(string, location.href, {
            builtInTagToUnitCompiler: tagToUnitCompiler,
            style
        });
        if (result === undefined) {
            return;
        }
        document.title = result.compiler.context.title;
        article.innerHTML = '';
        article.append(result.documentFragment);
        nav.innerHTML = '';
        nav.append(headingTreeToElement(extractHeadingTree(result.compiler.context)));
        await initParts([{ string, dir: location.href }], [article.children.length], undefined, focusLine, focusId);
    }
    async function autoLoad() {
        const params = new URLSearchParams(location.search);
        const focusURL = params.get('focus-url') ?? document.documentElement.dataset.focusUrl;
        const focusLineStr = params.get('focus-line') ?? document.documentElement.dataset.focusLine;
        let focusLine;
        if (focusLineStr !== undefined) {
            focusLine = Number(focusLineStr);
            if (!isFinite(focusLine) || focusLine % 1 !== 0) {
                focusLine = undefined;
            }
        }
        let focusId;
        if (location.hash.length > 1) {
            focusId = decodeURIComponent(location.hash.slice(1));
        }
        else
            (focusId = document.documentElement.dataset.focusId);
        const string = params.get('string') ?? document.documentElement.dataset.string;
        const src = params.get('src') ?? document.documentElement.dataset.src;
        if (string !== undefined) {
            await loadString(string, focusLine, focusId);
            return;
        }
        if (src !== undefined) {
            await load([src], focusURL, focusLine, focusId);
        }
    }
    return {
        element,
        style,
        main,
        sideContent,
        article,
        nav,
        panel,
        settings,
        dblClickLineListeners,
        initParts,
        load,
        loadString,
        autoLoad
    };
}
