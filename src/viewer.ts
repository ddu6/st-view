import {Div, LRStruct} from '@ddu6/stui'
import {multiCompile} from '@ddu6/stc'
import {css,tagToUnitCompiler} from 'st-std'
import {isRelURL, relURLToAbsURL, urlsToAbsURLs} from '@ddu6/urls'
import {all} from './lib/css'
export class Viewer extends LRStruct{
    readonly article=new Div(['article'])
    readonly headingView=new Div(['heading view'])
    constructor(){
        super('Viewer','',css+all)
        this.main.append(this.article)
        const params=new URLSearchParams(document.location.search)
        const src=params.get('src')??document.body.dataset.src??''
        if(src===''){
            return
        }
        const focusURL=params.get('focus-url')??document.body.dataset.focusUrl??''
        let focusLine=Number(params.get('focus-line')??document.body.dataset.focusLine??'')
        if(!isFinite(focusLine)){
            focusLine=0
        }
        const focusLabel=params.get('focus-label')??document.body.dataset.focusLabel??''
        this.load([src],focusURL,focusLine,focusLabel)
    }
    async load(urls:string[],focusURL='',focusLine=0,focusLabel=''){
        const absURLs=await urlsToAbsURLs(urls,document.location.href)
        const parts:{
            string:string
            dir:string
        }[]=[]
        for(let i=0;i<absURLs.length;i++){
            const url=absURLs[i]
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
        this.article.element.innerHTML=''
        this.article.append(documentFragment)
        if(
            parts.length===0
            ||documentFragment.children.length===0
        ){
            return
        }
        let focusPart=0
        if(focusURL!==''){
            if(isRelURL(focusURL)){
                focusURL=relURLToAbsURL(focusURL,document.location.href)
            }
            for(let i=0;i<parts.length;i++){
                const {dir}=parts[i]
                try{
                    if(new URL(focusURL).pathname===new URL(dir).pathname){
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
        }else if(focusLine>=documentFragment.children.length){
            focusLine=documentFragment.children.length-1
        }
        let focusEle:Element=this.article.element
        if(focusLine!==0){
            const div=documentFragment.children[focusLine]
            if(div!==undefined){
                focusEle=div
            }
        }
        if(focusLabel!==''){
            const anchor=focusEle.querySelector(`a[id=${JSON.stringify(focusLabel)}]`)
            if(anchor!==null){
                focusEle=anchor
            }
        }
        focusEle.scrollIntoView()
    }
}