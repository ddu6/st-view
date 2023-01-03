var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { getMod } from './import';
import { extractHeadingTree, headingTreeToElement } from './heading-tree';
export function createViewer() {
    return __awaiter(this, void 0, void 0, function* () {
        const { element, main, sideContent, article, settings } = (yield getMod('stui')).createASStruct();
        const style = document.createElement('style');
        const nav = document.createElement('nav');
        sideContent.prepend(nav);
        const dblClickLineListeners = [];
        const env = {};
        article.addEventListener('dblclick', (e) => __awaiter(this, void 0, void 0, function* () {
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
                    yield listener(part, offset, position);
                }
                return;
            }
        }));
        function focus(dir, focusURL, focusPositionStr, focusId) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                const { compiler } = env;
                if (compiler === undefined) {
                    return;
                }
                let focusPart;
                if (focusURL !== undefined) {
                    if (compiler.urls.isRelURL(focusURL)) {
                        focusURL = new URL(focusURL, dir).href;
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
                        offset = (_a = compiler.context.partToOffset.get(focusPart)) !== null && _a !== void 0 ? _a : 0;
                    }
                    const unitOrLines = compiler.position.positionToUnitOrLines(compiler.position.parsePositionStr(focusPositionStr), compiler.context.stdn, offset);
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
                    addEventListener('popstate', l, { once: true });
                    for (let i = 0; i < 100; i++) {
                        if (operated) {
                            break;
                        }
                        if (Math.abs(focusEle.getBoundingClientRect().top) > 1) {
                            focusEle.scrollIntoView();
                        }
                        yield new Promise(r => setTimeout(r, 100));
                    }
                }
            });
        }
        function loadCompileResult({ compiler, documentFragment }) {
            if (compiler.stop) {
                return false;
            }
            if (compiler.context.title.length > 0) {
                document.title = compiler.context.title;
            }
            article.innerHTML = '';
            article.append(documentFragment);
            nav.innerHTML = '';
            nav.append(headingTreeToElement(extractHeadingTree(compiler.context, compiler.base.unitToInlinePlainString)));
            env.compiler = compiler;
            return true;
        }
        function load(urls) {
            return __awaiter(this, void 0, void 0, function* () {
                element.classList.add('loading');
                const { compileURLs } = yield getMod('stc');
                const result = loadCompileResult(yield compileURLs(urls, {
                    builtInTagToUnitCompiler: yield getMod('ucs'),
                    style
                }));
                element.classList.remove('loading');
                return result;
            });
        }
        function loadString(string, url) {
            return __awaiter(this, void 0, void 0, function* () {
                element.classList.add('loading');
                const { compile } = yield getMod('stc');
                const result = loadCompileResult(yield compile([{
                        value: string,
                        url
                    }], {
                    builtInTagToUnitCompiler: yield getMod('ucs'),
                    style
                }));
                element.classList.remove('loading');
                return result;
            });
        }
        function autoLoad() {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                const { dataset } = document.documentElement;
                const { srcPolicy } = dataset;
                let { src, string } = dataset;
                const dir = new URL('.', new URL(src !== null && src !== void 0 ? src : '', location.href)).href;
                const params = new URLSearchParams(location.search);
                const unsafeSrc = params.get('src');
                if (unsafeSrc !== null) {
                    const fullSrc = new URL(unsafeSrc, dir).href;
                    if (srcPolicy === 'loose'
                        || fullSrc.startsWith(dir)) {
                        src = fullSrc;
                    }
                }
                const unsafeString = params.get('string');
                if (unsafeString !== null
                    && srcPolicy === 'loose') {
                    string = unsafeString;
                }
                const focusURL = (_a = params.get('focus-url')) !== null && _a !== void 0 ? _a : dataset.focusUrl;
                const focusPositionStr = (_b = params.get('focus-position')) !== null && _b !== void 0 ? _b : dataset.focusPosition;
                let focusId;
                if (location.hash.length > 1) {
                    focusId = decodeURIComponent(location.hash.slice(1));
                }
                else
                    (focusId = dataset.focusId);
                if (string !== undefined) {
                    if (!(yield loadString(string, dir))) {
                        return;
                    }
                }
                else if (src !== undefined) {
                    if (!(yield load([src]))) {
                        return;
                    }
                }
                yield focus(dir, focusURL, focusPositionStr, focusId);
            });
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
    });
}
