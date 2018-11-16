export async function getComp(path){
    let comp = await import(path);
    return comp;
}