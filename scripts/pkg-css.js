const fs=require('fs')
const path=require('path')
const names=[]
let out=''
for(const fileName of fs.readdirSync(path.join(__dirname,'../css'))){
    const name=fileName.split('.')[1].replace(/-/g,'_')
    names.push(name)
    out+=`export const ${name}=${
        JSON.stringify(fs.readFileSync(path.join(__dirname,'../css/'+fileName),{encoding:'utf8'}))
    }\n`
}
out+=`export const all=${names.join('+')}`
fs.writeFileSync(path.join(__dirname,'../src/lib/css.ts'),out)