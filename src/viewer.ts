import {Checkbox,CommonEle,Div,Form,FormLine,LRStruct} from '@ddu6/stui'
import {isRelURL,relURLToAbsURL,urlsToAbsURLs,multiCompile, compile} from '@ddu6/stc'
import {css,headCSS,tagToUnitCompiler} from 'st-std'
import {all} from './lib/css'
import {extractHeadingTree,headingTreeToElement} from './heading-tree'
interface Part{
    string:string
    dir:string
}
export class Viewer extends LRStruct{
    readonly headStyle=document.createElement('style')
    readonly customStyleEle=document.createElement('style')
    readonly article=new CommonEle('article',['article'])
    readonly headingTree=new CommonEle('nav',['heading tree'])
    readonly selects={
        colorScheme:document.createElement('select'),
        fontSize:document.createElement('select'),
    }
    readonly checkboxes={
        settings:new Checkbox('settings',['show name','left']),
    }
    readonly forms={
        panel:new Form('panel'),
        settings:new Form('settings',['hide']),
    }
    dblClickLineListeners:((
        line:number,
        url:string,
        partialLine:number,
    )=>Promise<void>)[]=[]
    constructor(){
        super('Viewer','',css+all)
        this.headStyle.textContent=headCSS
        document.body.prepend(this.headStyle)
        document.body.append(this.customStyleEle)
        this.main.append(this.article)
        this.sideContent
        .append(this.headingTree)
        .append(
            this.forms.panel
            .append(this.checkboxes.settings)
            .append(
                this.forms.settings
                .append(
                    new FormLine('color scheme')
                    .append(this.selects.colorScheme)
                )
                .append(
                    new FormLine('font size')
                    .append(this.selects.fontSize)
                )
            )
        )
        this.selects.colorScheme.innerHTML='<option>auto</option><option>dark</option><option>light</option>'
        this.selects.fontSize.innerHTML='<option>small</option><option>medium</option><option>large</option>'
        document.documentElement.dataset.colorScheme
        =this.selects.colorScheme.value
        =window.localStorage.getItem('st-color-scheme')
        ??document.documentElement.dataset.colorScheme
        ??'auto'
        document.documentElement.dataset.fontSize
        =this.selects.fontSize.value
        =window.localStorage.getItem('st-font-size')
        ??document.documentElement.dataset.fontSize
        ??'small'
        this.selects.colorScheme.addEventListener('input',()=>{
            window.localStorage.setItem(
                'st-color-scheme',
                document.documentElement.dataset.colorScheme=this.selects.colorScheme.value
            )
        })
        this.selects.fontSize.addEventListener('input',()=>{
            window.localStorage.setItem(
                'st-font-size',
                document.documentElement.dataset.fontSize=this.selects.fontSize.value
            )
        })
        this.checkboxes.settings.addEventListener('click',()=>{
            if(this.checkboxes.settings.classList.toggle('checked')){
                this.forms.settings.classList.remove('hide')
            }else{
                this.forms.settings.classList.add('hide')
            }
        })
        const params=new URLSearchParams(location.search)
        const focusURL=params.get('focus-url')??document.documentElement.dataset.focusUrl??''
        let focusLine=Number(params.get('focus-line')??document.documentElement.dataset.focusLine??'')
        if(!isFinite(focusLine)){
            focusLine=0
        }
        let focusId=decodeURIComponent(location.hash)
        if(focusId.length===0){
            focusId=document.documentElement.dataset.focusId??''
        }else if(focusId.startsWith('#'))(
            focusId=focusId.slice(1)
        )
        const string=params.get('string')??document.documentElement.dataset.string??''
        const src=params.get('src')??document.documentElement.dataset.src??''
        if(string.length>0){
            this.loadString(string,focusLine,focusId)
            return
        }
        if(src.length>0){
            this.load([src],focusURL,focusLine,focusId)
            return
        }
    }
    private initParts(parts:Part[],partLengths:number[],focusURL:string,focusLine:number,focusId:string){
        if(
            parts.length===0
            ||this.article.children.length===0
        ){
            return
        }
        let line=0
        for(let i=0;i<partLengths.length;i++){
            const partLength=partLengths[i]
            const {dir}=parts[i]
            for(let partialLine=0;partialLine<partLength;partialLine++){
                const lineEle=this.article.children[line]
                const staticLine=line
                lineEle.addEventListener('dblclick',async ()=>{
                    for(const listener of this.dblClickLineListeners){
                        await listener(staticLine,dir,partialLine)
                    }
                })
                line++
            }
        }
        let focusPart=0
        if(focusURL.length>0){
            if(isRelURL(focusURL)){
                focusURL=relURLToAbsURL(focusURL,location.href)
            }
            for(let i=0;i<parts.length;i++){
                const {dir}=parts[i]
                try{
                    const tmp0=new URL(focusURL)
                    const tmp1=new URL(dir)
                    if(tmp0.origin===tmp1.origin&&tmp0.pathname===tmp1.pathname){
                        focusPart=i
                        break
                    }
                }catch(err){
                    console.log(err)
                }
            }
        }
        for(let i=0;i<focusPart;i++){
            focusLine+=partLengths[i]
        }
        if(focusLine<0){
            focusLine=0
        }else if(focusLine>=this.article.children.length){
            focusLine=this.article.children.length-1
        }
        let focusEle:Element=this.article.element
        if(focusLine!==0){
            const div=this.article.children[focusLine]
            if(div!==undefined){
                focusEle=div
            }
        }
        if(focusId.length>0){
            const anchor=focusEle.querySelector(`[id=${JSON.stringify(focusId)}]`)
            if(anchor!==null){
                focusEle=anchor
            }
        }
        if(focusEle!==this.article.element){
            focusEle.scrollIntoView()
            setTimeout(()=>{
                focusEle.scrollIntoView()
            },100)
            setTimeout(()=>{
                focusEle.scrollIntoView()
            },500)
        }
    }
    async load(urls:string[],focusURL='',focusLine=0,focusId=''){
        const parts:Part[]=[]
        for(const url of await urlsToAbsURLs(urls,location.href)){
            try{
                const res=await window.fetch(url)
                if(!res.ok){
                    continue
                }
                parts.push({
                    string:await res.text(),
                    dir:url
                })
            }catch(err){
                console.log(err)
            }
        }
        const {documentFragment,context,partLengths}=await multiCompile(parts,{
            dftTagToUnitCompiler:tagToUnitCompiler
        })
        document.title=context.title
        this.customStyleEle.textContent=context.css
        this.article.element.innerHTML=''
        this.article.append(documentFragment)
        this.headingTree.element.innerHTML=''
        this.headingTree.append(headingTreeToElement(extractHeadingTree(context)))
        this.initParts(parts,partLengths,focusURL,focusLine,focusId)
    }
    async loadString(string:string,focusLine=0,focusId=''){
        const result=await compile(string,location.href,{
            dftTagToUnitCompiler:tagToUnitCompiler
        })
        if(result===undefined){
            return
        }
        const {documentFragment,context}=result
        document.title=context.title
        this.customStyleEle.textContent=context.css
        this.article.element.innerHTML=''
        this.article.append(documentFragment)
        this.headingTree.element.innerHTML=''
        this.headingTree.append(headingTreeToElement(extractHeadingTree(context)))
        this.initParts([{string,dir:location.href}],[this.article.children.length],'',focusLine,focusId)
    }
}