export async function hi(unit){
    const ele=document.createElement('span')
    ele.textContent='Hi '+unit.options.name+'!'
    return ele
}