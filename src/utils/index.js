
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

/**
 * @param {*} args
 * @returns {boolean} 
 */
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

/**
 * @param1 {any, object} o - obj needs to deeply check&grab isExist props
 * @param2 {string} props - the chain props(use dot character), which needs deeply check&grab
 * @return {any} field - return the prop value, if it not exist return undefined.
 */
export function deepExtract(o, props) {
  const [first, ...remaining] = props.split('.');
  return (
    o == null
    // when o is undefined or null return undefined directly
      ? undefined
      : (remaining.length)
        ? deepExtract(o[first], remaining.join('.'))
        : o[first]
  );
}
