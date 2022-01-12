import type {multiCompile, STDNPart} from '@ddu6/stc'
import {getMod} from './import'
import {extractHeadingTree, headingTreeToElement} from './heading-tree'
export interface ViewerContent extends Awaited<ReturnType<typeof multiCompile>> {
    parts: STDNPart[]
    focusURL: string | undefined
    focusLine: number | undefined
    focusId: string | undefined
}
export async function createViewer() {
    const {element, main, sideContent, article, settings} = ((await getMod('stui')).createASStruct)()
    const style = document.createElement('style')
    const nav = document.createElement('nav')
    sideContent.prepend(nav)
    const dblClickLineListeners: ((line: number, url: string, partialLine: number) => Promise<void>)[] = []
    const env: {
        content?: ViewerContent
    } = {}
    async function initParts({compiler, parts, partLengths, focusURL, focusLine, focusId}: ViewerContent) {
        if (parts.length === 0 || article.children.length === 0) {
            return
        }
        let line = 0
        for (let i = 0; i < partLengths.length; i++) {
            const partLength = partLengths[i]
            const {dir} = parts[i]
            for (let partialLine = 0; partialLine < partLength; partialLine++) {
                const lineEle = article.children[line]
                const staticLine = line
                lineEle.addEventListener('dblclick', async () => {
                    for (const listener of dblClickLineListeners) {
                        await listener(staticLine, dir, partialLine)
                    }
                })
                line++
            }
        }
        let focusPart = 0
        if (focusURL !== undefined) {
            if (compiler.urls.isRelURL(focusURL)) {
                focusURL = new URL(focusURL, location.href).href
            }
            const {origin, pathname} = new URL(focusURL)
            for (let i = 0; i < parts.length; i++) {
                const url = new URL(parts[i].dir)
                if (url.origin === origin && url.pathname === pathname) {
                    focusPart = i
                    break
                }
            }
        }
        let focusEle: Element = article
        if (focusLine !== undefined) {
            for (let i = 0; i < focusPart; i++) {
                focusLine += partLengths[i]
            }
            if (focusLine < 0) {
                focusLine = 0
            } else if (focusLine >= article.children.length) {
                focusLine = article.children.length - 1
            }
            const div = article.children[focusLine]
            if (div !== undefined) {
                focusEle = div
            }
        }
        if (focusId !== undefined) {
            const anchor = focusEle.querySelector(`[id=${JSON.stringify(focusId)}]`)
            if (anchor !== null) {
                focusEle = anchor
            }
        }
        if (focusEle !== article) {
            let operated = false
            const l = () => {
                operated = true
            }
            addEventListener('wheel', l, {once: true})
            addEventListener('touchmove', l, {once: true})
            addEventListener('keydown', l, {once: true})
            addEventListener('click', l, {once: true})
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
    async function load(urls: string[], focusURL?: string, focusLine?: number, focusId?: string) {
        const {multiCompile, urlsToAbsURLs} = await getMod('stc')
        const partPromises: Promise<STDNPart[]>[] = []
        for (const url of await urlsToAbsURLs(urls, location.href)) {
            partPromises.push((async () => {
                try {
                    const res = await fetch(url)
                    if (!res.ok) {
                        return []
                    }
                    return [{
                        string: await res.text(),
                        dir: url
                    }]
                } catch (err) {
                    console.log(err)
                    return []
                }
            })())
        }
        const parts = (await Promise.all(partPromises)).flat()
        const {compiler, documentFragment, partLengths, stdn} = await multiCompile(parts, {
            builtInTagToUnitCompiler: await getMod('ucs'),
            style
        })
        document.title = compiler.context.title
        article.innerHTML = ''
        article.append(documentFragment)
        nav.innerHTML = ''
        nav.append(headingTreeToElement(extractHeadingTree(compiler.context, compiler.base.unitToInlinePlainString)))
        await initParts(env.content = {
            compiler,
            documentFragment,
            parts,
            partLengths,
            stdn,
            focusURL,
            focusLine,
            focusId
        })
    }
    async function loadString(string: string, focusLine?: number, focusId?: string) {
        const {compile} = await getMod('stc')
        const result = await compile(string, location.href, {
            builtInTagToUnitCompiler: await getMod('ucs'),
            style
        })
        if (result === undefined) {
            return
        }
        const {compiler, documentFragment, stdn} = result
        document.title = compiler.context.title
        article.innerHTML = ''
        article.append(documentFragment)
        nav.innerHTML = ''
        nav.append(headingTreeToElement(extractHeadingTree(compiler.context, compiler.base.unitToInlinePlainString)))
        await initParts(env.content = {
            compiler,
            documentFragment,
            parts: [{string, dir: location.href}],
            partLengths: [stdn.length],
            stdn,
            focusURL: undefined,
            focusLine,
            focusId
        })
    }
    async function autoLoad() {
        const params = new URLSearchParams(location.search)
        const focusURL = params.get('focus-url') ?? document.documentElement.dataset.focusUrl
        const focusLineStr = params.get('focus-line') ?? document.documentElement.dataset.focusLine
        let focusLine: number | undefined
        if (focusLineStr !== undefined) {
            focusLine = Number(focusLineStr)
            if (!isFinite(focusLine) || focusLine % 1 !== 0) {
                focusLine = undefined
            }
        }
        let focusId: string | undefined
        if (location.hash.length > 1) {
            focusId = decodeURIComponent(location.hash.slice(1))
        } else (
            focusId = document.documentElement.dataset.focusId
        )
        const string = params.get('string') ?? document.documentElement.dataset.string
        const src = params.get('src') ?? document.documentElement.dataset.src
        if (string !== undefined) {
            await loadString(string, focusLine, focusId)
            return
        }
        if (src !== undefined) {
            await load([src], focusURL, focusLine, focusId)
        }
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
        initParts,
        load,
        loadString,
        autoLoad
    }
}