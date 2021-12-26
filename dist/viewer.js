import { compile, isRelURL, multiCompile, relURLToAbsURL, urlsToAbsURLs } from '@ddu6/stc';
import { createLRStruct } from '@ddu6/stui';
import { tagToUnitCompiler } from 'st-std';
import { extractHeadingTree, headingTreeToElement } from './heading-tree';
export function createNamedElement(name, element) {
    const line = document.createElement('div');
    const label = document.createElement('div');
    label.textContent = name;
    line.append(label);
    line.append(element);
    return line;
}
export async function createViewer() {
    const { element, main, sideContent } = createLRStruct();
    const style = document.createElement('style');
    const article = document.createElement('article');
    const nav = document.createElement('nav');
    const colorScheme = document.createElement('select');
    const fontSize = document.createElement('select');
    const panel = document.createElement('div');
    const settingsButton = document.createElement('div');
    const settings = document.createElement('div');
    settings.classList.add('hide');
    const dblClickLineListeners = [];
    const content = {};
    main.append(article);
    sideContent.append(nav);
    sideContent.append(panel);
    panel.append(settingsButton);
    panel.append(settings);
    settings.append(createNamedElement('Color Scheme', colorScheme));
    settings.append(createNamedElement('Font Size', fontSize));
    colorScheme.innerHTML = '<option>auto</option><option>dark</option><option>light</option>';
    fontSize.innerHTML = '<option>small</option><option>medium</option><option>large</option>';
    document.documentElement.dataset.colorScheme
        = colorScheme.value
            = window.localStorage.getItem('st-color-scheme')
                ?? document.documentElement.dataset.colorScheme
                ?? 'auto';
    document.documentElement.dataset.fontSize
        = fontSize.value
            = window.localStorage.getItem('st-font-size')
                ?? document.documentElement.dataset.fontSize
                ?? 'small';
    colorScheme.addEventListener('change', () => {
        window.localStorage.setItem('st-color-scheme', document.documentElement.dataset.colorScheme = colorScheme.value);
    });
    fontSize.addEventListener('change', () => {
        window.localStorage.setItem('st-font-size', document.documentElement.dataset.fontSize = fontSize.value);
    });
    settingsButton.addEventListener('click', () => {
        if (settingsButton.classList.toggle('checked')) {
            settings.classList.remove('hide');
        }
        else {
            settings.classList.add('hide');
        }
    });
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
        if (focusURL.length > 0) {
            if (isRelURL(focusURL)) {
                focusURL = relURLToAbsURL(focusURL, location.href);
            }
            for (let i = 0; i < parts.length; i++) {
                const { dir } = parts[i];
                try {
                    const tmp0 = new URL(focusURL);
                    const tmp1 = new URL(dir);
                    if (tmp0.origin === tmp1.origin && tmp0.pathname === tmp1.pathname) {
                        focusPart = i;
                        break;
                    }
                }
                catch (err) {
                    console.log(err);
                }
            }
        }
        for (let i = 0; i < focusPart; i++) {
            focusLine += partLengths[i];
        }
        if (focusLine < 0) {
            focusLine = 0;
        }
        else if (focusLine >= article.children.length) {
            focusLine = article.children.length - 1;
        }
        let focusEle = article;
        if (focusLine !== 0) {
            const div = article.children[focusLine];
            if (div !== undefined) {
                focusEle = div;
            }
        }
        if (focusId.length > 0) {
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
    async function load(urls, focusURL = '', focusLine = 0, focusId = '') {
        const parts = [];
        for (const url of await urlsToAbsURLs(urls, location.href)) {
            try {
                const res = await window.fetch(url);
                if (!res.ok) {
                    continue;
                }
                parts.push({
                    string: await res.text(),
                    dir: url
                });
            }
            catch (err) {
                console.log(err);
            }
        }
        const result = await multiCompile(parts, {
            builtInTagToUnitCompiler: tagToUnitCompiler,
            style
        });
        content.compiler = result.compiler;
        content.doc = result.doc;
        content.partLengths = result.partLengths;
        document.title = result.compiler.context.title;
        article.innerHTML = '';
        article.append(result.documentFragment);
        nav.innerHTML = '';
        nav.append(headingTreeToElement(extractHeadingTree(result.compiler.context)));
        await initParts(parts, result.partLengths, focusURL, focusLine, focusId);
    }
    async function loadString(string, focusLine = 0, focusId = '') {
        const result = await compile(string, location.href, {
            builtInTagToUnitCompiler: tagToUnitCompiler,
            style
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
        nav.append(headingTreeToElement(extractHeadingTree(result.compiler.context)));
        await initParts([{ string, dir: location.href }], [article.children.length], '', focusLine, focusId);
    }
    async function autoLoad() {
        const params = new URLSearchParams(location.search);
        const focusURL = params.get('focus-url') ?? document.documentElement.dataset.focusUrl ?? '';
        let focusLine = Number(params.get('focus-line') ?? document.documentElement.dataset.focusLine ?? '');
        if (!isFinite(focusLine) || focusLine % 1 !== 0) {
            focusLine = 0;
        }
        let focusId = decodeURIComponent(location.hash);
        if (focusId.length === 0) {
            focusId = document.documentElement.dataset.focusId ?? '';
        }
        else if (focusId.startsWith('#'))
            (focusId = focusId.slice(1));
        const string = params.get('string') ?? document.documentElement.dataset.string ?? '';
        const src = params.get('src') ?? document.documentElement.dataset.src ?? '';
        if (string.length > 0) {
            await loadString(string, focusLine, focusId);
            return;
        }
        if (src.length > 0) {
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
