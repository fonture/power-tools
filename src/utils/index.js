
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

export function keepDecimal(num, digit) {
    if (typeof num === 'number') {
        return Math.round(num * Math.pow(10, digit)) / Math.pow(10, digit)
    } else {
        return num
    }
}

export function validate(...args) {
    let length = args.length;
    for (let i = 0; i < length; i++) {
        let value = args[i];
        if (value === undefined || value === null || value === '') {
            return false
        }
    }
    return true
}