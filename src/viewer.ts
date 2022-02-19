import type {STDNPosition} from 'stdn'
import type {compile, Compiler, STDNPart} from '@ddu6/stc'
import {getMod} from './import'
import {extractHeadingTree, headingTreeToElement} from './heading-tree'
export async function createViewer() {
    const {element, main, sideContent, article, settings} = (await getMod('stui')).createASStruct()
    const style = document.createElement('style')
    const nav = document.createElement('nav')
    sideContent.prepend(nav)
    const dblClickLineListeners: ((part: STDNPart, offset: number, position: STDNPosition) => Promise<void>)[] = []
    const env: {
        compiler?: Compiler
    } = {}
    article.addEventListener('dblclick', async e => {
        const {compiler} = env
        if (compiler === undefined) {
            return
        }
        for (const target of e.composedPath()) {
            if (!(target instanceof HTMLElement) && !(target instanceof SVGElement)) {
                continue
            }
            const unitOrLine = compiler.elementToUnitOrLine.get(target)
            if (unitOrLine === undefined) {
                continue
            }
            const part = compiler.context.unitOrLineToPart.get(unitOrLine)
            if (part === undefined) {
                continue
            }
            const offset = compiler.context.partToOffset.get(part)
            if (offset === undefined) {
                continue
            }
            const position = compiler.context.unitOrLineToPosition.get(unitOrLine)
            if (position === undefined) {
                continue
            }
            for (const listener of dblClickLineListeners) {
                await listener(part, offset, position)
            }
            return
        }
    })
    async function focus(focusURL?: string, focusPositionStr?: string, focusId?: string) {
        const {compiler} = env
        if (compiler === undefined) {
            return
        }
        let focusPart: STDNPart | undefined
        if (focusURL !== undefined) {
            if (compiler.urls.isRelURL(focusURL)) {
                focusURL = new URL(focusURL, location.href).href
            }
            const {origin, pathname} = new URL(focusURL)
            const {parts} = compiler.context
            for (const part of parts) {
                const url = new URL(part.url)
                if (url.origin === origin && url.pathname === pathname) {
                    focusPart = part
                    break
                }
            }
        }
        let focusEle: Element = article
        if (focusPositionStr !== undefined) {
            let offset = 0
            if (focusPart !== undefined) {
                offset = compiler.context.partToOffset.get(focusPart) ?? 0
            }
            const unitOrLines = compiler.position.positionToUnitOrLines(compiler.position.parsePositionStr(focusPositionStr), compiler.context.stdn, offset)
            for (let i = unitOrLines.length - 1; i >= 0; i--) {
                const elements = compiler.unitOrLineToElements.get(unitOrLines[i])
                if (elements !== undefined && elements.length > 0) {
                    focusEle = elements[elements.length - 1]
                    break
                }
            }
        }
        if (focusId !== undefined) {
            const element = focusEle.querySelector(`[id=${JSON.stringify(focusId)}]`)
            if (element !== null) {
                focusEle = element
            }
        }
        if (focusEle !== article) {
            let operated = false
            const l = () => {
                operated = true
            }
            addEventListener('click', l, {once: true})
            addEventListener('keydown', l, {once: true})
            addEventListener('touchmove', l, {once: true})
            addEventListener('wheel', l, {once: true})
            for (let i = 0; i < 100; i++) {
                if (operated) {
                    break
                }
                if (Math.abs(focusEle.getBoundingClientRect().top) > 1) {
                    focusEle.scrollIntoView()
                }
                await new Promise(r => setTimeout(r, 100))
            }
        }
    }
    function loadCompileResult({compiler, documentFragment}: Awaited<ReturnType<typeof compile>>) {
        document.title = compiler.context.title
        article.innerHTML = ''
        article.append(documentFragment)
        nav.innerHTML = ''
        nav.append(headingTreeToElement(extractHeadingTree(compiler.context, compiler.base.unitToInlinePlainString)))
        env.compiler = compiler
    }
    async function load(urls: string[]) {
        element.classList.add('loading')
        const {compileURLs} = await getMod('stc')
        loadCompileResult(await compileURLs(urls, {
            builtInTagToUnitCompiler: await getMod('ucs'),
            style
        }))
        element.classList.remove('loading')
    }
    async function loadString(string: string) {
        element.classList.add('loading')
        const {compile} = await getMod('stc')
        loadCompileResult(await compile([{
            value: string,
            url: location.href
        }], {
            builtInTagToUnitCompiler: await getMod('ucs'),
            style
        }))
        element.classList.remove('loading')
    }
    async function autoLoad() {
        const params = new URLSearchParams(location.search)
        const focusURL = params.get('focus-url') ?? document.documentElement.dataset.focusUrl
        const focusPositionStr = params.get('focus-position') ?? document.documentElement.dataset.focusPosition
        let focusId: string | undefined
        if (location.hash.length > 1) {
            focusId = decodeURIComponent(location.hash.slice(1))
        } else (
            focusId = document.documentElement.dataset.focusId
        )
        const string = params.get('string') ?? document.documentElement.dataset.string
        const src = params.get('src') ?? document.documentElement.dataset.src
        if (string !== undefined) {
            await loadString(string)
        } else if (src !== undefined) {
            await load([src])
        }
        await focus(focusURL, focusPositionStr, focusId)
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
    }
}