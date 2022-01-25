import { getMod } from './import';
import { extractHeadingTree, headingTreeToElement } from './heading-tree';
export function parsePositionStr(string) {
    return string.trim().split(/\s+/).map(value => {
        if (/^\d+$/.test(value)) {
            return Number(value);
        }
        if (value.startsWith('"')) {
            return value.slice(1, -1);
        }
        return value;
    });
}
export function positionToUnitOrLines(offset, position, stdn) {
    const out = [];
    if (position.length === 0 || stdn.length === 0) {
        return out;
    }
    const line = position[0];
    if (typeof line !== 'number') {
        return out;
    }
    let unitOrLine = stdn[Math.min(line + offset, stdn.length - 1)];
    out.push(unitOrLine);
    for (let i = 1; i < position.length; i++) {
        const step = position[i];
        if (typeof step === 'number') {
            if (Array.isArray(unitOrLine)) {
                const unit = unitOrLine[step];
                if (typeof unit !== 'object') {
                    break;
                }
                out.push(unitOrLine = unit);
                continue;
            }
            const line = unitOrLine.children[step];
            if (line === undefined) {
                break;
            }
            out.push(unitOrLine = line);
            continue;
        }
        if (Array.isArray(unitOrLine)) {
            break;
        }
        const stdn = unitOrLine.options[step];
        if (!Array.isArray(stdn)) {
            break;
        }
        const nextStep = position[++i];
        if (typeof nextStep !== 'number') {
            break;
        }
        const line = stdn[nextStep];
        if (line === undefined) {
            break;
        }
        out.push(unitOrLine = line);
    }
    return out;
}
export async function createViewer() {
    const { element, main, sideContent, article, settings } = ((await getMod('stui')).createASStruct)();
    const style = document.createElement('style');
    const nav = document.createElement('nav');
    sideContent.prepend(nav);
    const dblClickLineListeners = [];
    const env = {};
    article.addEventListener('dblclick', async (e) => {
        const { compiler } = env;
        if (compiler === undefined) {
            return;
        }
        for (const target of e.composedPath()) {
            if (!(target instanceof HTMLElement) && !(target instanceof SVGElement)) {
                continue;
            }
            const unitOrLine = compiler.elementToUnitOrLine.get(target);
            if (unitOrLine === undefined) {
                continue;
            }
            const part = compiler.context.unitOrLineToPart.get(unitOrLine);
            if (part === undefined) {
                continue;
            }
            const offset = compiler.context.partToOffset.get(part);
            if (offset === undefined) {
                continue;
            }
            const position = compiler.context.unitOrLineToPosition.get(unitOrLine);
            if (position === undefined) {
                continue;
            }
            for (const listener of dblClickLineListeners) {
                await listener(part, offset, position);
            }
            return;
        }
    });
    async function focus(focusURL, focusPositionStr, focusId) {
        const { compiler } = env;
        if (compiler === undefined) {
            return;
        }
        let focusPart;
        if (focusURL !== undefined) {
            if (compiler.urls.isRelURL(focusURL)) {
                focusURL = new URL(focusURL, location.href).href;
            }
            const { origin, pathname } = new URL(focusURL);
            const { parts } = compiler.context;
            for (const part of parts) {
                const url = new URL(part.url);
                if (url.origin === origin && url.pathname === pathname) {
                    focusPart = part;
                    break;
                }
            }
        }
        let focusEle = article;
        if (focusPositionStr !== undefined) {
            let offset = 0;
            if (focusPart !== undefined) {
                offset = compiler.context.partToOffset.get(focusPart) ?? 0;
            }
            const unitOrLines = positionToUnitOrLines(offset, parsePositionStr(focusPositionStr), compiler.context.stdn);
            for (let i = unitOrLines.length - 1; i >= 0; i--) {
                const elements = compiler.unitOrLineToElements.get(unitOrLines[i]);
                if (elements !== undefined && elements.length > 0) {
                    focusEle = elements[elements.length - 1];
                    break;
                }
            }
        }
        if (focusId !== undefined) {
            const element = focusEle.querySelector(`[id=${JSON.stringify(focusId)}]`);
            if (element !== null) {
                focusEle = element;
            }
        }
        if (focusEle !== article) {
            let operated = false;
            const l = () => {
                operated = true;
            };
            addEventListener('click', l, { once: true });
            addEventListener('keydown', l, { once: true });
            addEventListener('touchmove', l, { once: true });
            addEventListener('wheel', l, { once: true });
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
    function loadCompileResult({ compiler, documentFragment }) {
        document.title = compiler.context.title;
        article.innerHTML = '';
        article.append(documentFragment);
        nav.innerHTML = '';
        nav.append(headingTreeToElement(extractHeadingTree(compiler.context, compiler.base.unitToInlinePlainString)));
        env.compiler = compiler;
    }
    async function load(urls) {
        const { compileURLs } = await getMod('stc');
        loadCompileResult(await compileURLs(urls, {
            builtInTagToUnitCompiler: await getMod('ucs'),
            style
        }));
    }
    async function loadString(string) {
        const { compile } = await getMod('stc');
        loadCompileResult(await compile([{
                value: string,
                url: location.href
            }], {
            builtInTagToUnitCompiler: await getMod('ucs'),
            style
        }));
    }
    async function autoLoad() {
        const params = new URLSearchParams(location.search);
        const focusURL = params.get('focus-url') ?? document.documentElement.dataset.focusUrl;
        const focusPositionStr = params.get('focus-position') ?? document.documentElement.dataset.focusPosition;
        let focusId;
        if (location.hash.length > 1) {
            focusId = decodeURIComponent(location.hash.slice(1));
        }
        else
            (focusId = document.documentElement.dataset.focusId);
        const string = params.get('string') ?? document.documentElement.dataset.string;
        const src = params.get('src') ?? document.documentElement.dataset.src;
        if (string !== undefined) {
            await loadString(string);
        }
        else if (src !== undefined) {
            await load([src]);
        }
        await focus(focusURL, focusPositionStr, focusId);
    }
    return {
        element,
        style,
        main,
        sideContent,
        article,
        nav,
        settings,
        dblClickLineListeners,
        env,
        focus,
        load,
        loadString,
        autoLoad
    };
}
