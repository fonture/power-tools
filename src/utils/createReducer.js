/*
 * @Author: ouyangdc 
 * @Date: 2018-11-15 11:28:43 
 * @Description: 动态创建reducer
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-29 17:28:08
 */
export default (type, args) => (state, action) => {
    const argType = typeof args
    if(argType === 'number'){
        state = state || 0
    }else if(argType === 'string') {
        state = state || ''
    }else if(argType === 'boolean') {
        state = state || true
    }else if(argType === 'object') {
        if(Array.isArray(args)){
            state = state || []
        }else {
            state = state || {}
        }
    }
    if (type === action.type) {
        // return Object.assign({}, state, {
        //     [argsName]: action.payload
        // })
        return action.payload
    } 
    return state
}