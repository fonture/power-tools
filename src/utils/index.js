export async function getComp(path) {
    let comp = await import(path);
    return comp;
}

export const report = {
    evens: [],
    on(fn) {
        if (typeof fn === 'function') {
            this.evens.push(fn)
        }
    },
    emit() {
        this.evens.forEach(e => e());
    }
}