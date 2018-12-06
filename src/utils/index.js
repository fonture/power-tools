
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
// 保留小数
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
        if (value === undefined || value === null || value === '' || isNaN(value)) {
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


/**
 * 数字千分位分隔符格式化
 *
 * @export
 * @param {*} num
 * @returns
 */
export function toThousands(num) {
    return (num || 0).toString().replace(/(\d)(?=(?:\d{3})+$)/g, '$1,');
}

/**
 * @description 重新定位“上一步”“下一步”按钮的位置
 * @author ouyangdc
 * @export
 */
export function reLocateButton() {
    const dom = document.querySelector('.btn-group')
    dom.style.position = 'relative'
    dom.style.marginTop = '20px'
    dom.style.marginBottom = '20px'
    dom.style.bottom = 'auto'
    // dom.style.background = '#fff'
    // dom.querySelector('.at-button--secondary').style.background='#efefef'
    // 视口区高度
    const clientHeight = document.documentElement.clientHeight

    // 按钮组距离顶部的距离
    const offsetTop = dom.offsetTop
    /* 
     * 如果按钮组距离顶部的距离加上按钮组的高度没有超过可视区的高度，则按钮组相对于底部绝对定位
     * 32是按钮组的padding值，80是按钮组的高度
     * 第一个20表示按钮组的marginTop，第二个20表示按钮的marginBottom
     */
    if(offsetTop + 80 < clientHeight) {
        dom.style.position = 'absolute'
        dom.style.bottom = '20px'
        dom.style.marginTop = '0'
        dom.style.marginBottom = '0'
    }
}