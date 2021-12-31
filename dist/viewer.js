import { compile, isRelURL, multiCompile, urlsToAbsURLs } from '@ddu6/stc';
import { createLRStruct } from '@ddu6/stui';
import { tagToUnitCompiler } from 'st-std';
import { extractHeadingTree, headingTreeToElement } from './heading-tree';
export function createNamedElement(name, element, document) {
    const line = document.createElement('div');
    const label = document.createElement('div');
    label.textContent = name;
    line.append(label);
    line.append(element);
    return line;
}
export function createViewer(options = {}) {
    const window0 = options.window ?? window;
    const { document, location, localStorage, addEventListener } = window0;
    const { element, main, sideContent } = createLRStruct();
    const style = document.createElement('style');
    const article = document.createElement('article');
    const nav = document.createElement('nav');
    const panel = document.createElement('div');
    const settingsButton = document.createElement('button');
    const settings = document.createElement('div');
    const colorScheme = document.createElement('select');
    const fontSize = document.createElement('select');
    settingsButton.textContent = 'Settings';
    settings.classList.add('hide');
    colorScheme.innerHTML = '<option>auto</option><option>dark</option><option>light</option>';
    fontSize.innerHTML = '<option>small</option><option>medium</option><option>large</option>';
    main.append(article);
    sideContent.append(nav);
    sideContent.append(panel);
    panel.append(settingsButton);
    panel.append(settings);
    settings.append(createNamedElement('Color Scheme', colorScheme, document));
    settings.append(createNamedElement('Font Size', fontSize, document));
    settingsButton.addEventListener('click', () => {
        if (settingsButton.classList.toggle('pushing')) {
            settings.classList.remove('hide');
        }
        else {
            settings.classList.add('hide');
        }
    });
    document.documentElement.dataset.colorScheme
        = colorScheme.value
            = localStorage.getItem('st-color-scheme')
                ?? document.documentElement.dataset.colorScheme
                ?? 'auto';
    document.documentElement.dataset.fontSize
        = fontSize.value
            = localStorage.getItem('st-font-size')
                ?? document.documentElement.dataset.fontSize
                ?? 'small';
    colorScheme.addEventListener('change', () => {
        localStorage.setItem('st-color-scheme', document.documentElement.dataset.colorScheme = colorScheme.value);
    });
    fontSize.addEventListener('change', () => {
        localStorage.setItem('st-font-size', document.documentElement.dataset.fontSize = fontSize.value);
    });
    const dblClickLineListeners = [];
    const content = {};
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
            addEventListener('wheel', l);
            addEventListener('touchmove', l);
            addEventListener('keydown', l);
            addEventListener('click', l);
            for (let i = 0; i < 100; i++) {
                if (operated) {
                    break;
                }
                if (Math.abs(focusEle.getBoundingClientRect().top) > 1) {
                    focusEle.scrollIntoView();
                }
                await new Promise(r => setTimeout(r, 100));
            }
            removeEventListener('wheel', l);
            removeEventListener('touchmove', l);
            removeEventListener('keydown', l);
            removeEventListener('click', l);
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
            style,
            root: window0,
            window: window0
        });
        content.compiler = result.compiler;
        content.doc = result.doc;
        content.partLengths = result.partLengths;
        document.title = result.compiler.context.title;
        article.innerHTML = '';
        article.append(result.documentFragment);
        nav.innerHTML = '';
        nav.append(headingTreeToElement(extractHeadingTree(result.compiler.context), document));
        await initParts(parts, result.partLengths, focusURL, focusLine, focusId);
    }
    async function loadString(string, focusLine, focusId) {
        const result = await compile(string, location.href, {
            builtInTagToUnitCompiler: tagToUnitCompiler,
            style,
            root: window0,
            window: window0
        });
        if (result === undefined) {
            return;
        }
        content.compiler = result.compiler;
        content.doc = result.doc;
        document.title = result.compiler.context.title;
        article.innerHTML = '';
        article.append(result.documentFragment);
        nav.innerHTML = '';
        nav.append(headingTreeToElement(extractHeadingTree(result.compiler.context), document));
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
        content,
        dblClickLineListeners,
        initParts,
        load,
        loadString,
        autoLoad
    };
}
