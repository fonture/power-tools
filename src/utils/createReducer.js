/*
 * @Author: ouyangdc 
 * @Date: 2018-11-15 11:28:43 
 * @Description: 动态创建reducer
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-30 14:47:41
 */
export default (type, args) => {
    let initState = {}
    const argType = typeof args
    if(argType === 'number'){
        initState = 0
    }else if(argType === 'string') {
        initState = ''
    }else if(argType === 'boolean') {
        initState = true
    }else if(argType === 'object') {
        if(Array.isArray(args)){
            initState = []
        }else {
            initState = {}
        }
    }
    return (state = initState, action) => {
        if (type === action.type) {
            if(typeof action.payload === 'object'){
                if(Array.isArray(action.payload)){
                    return [...action.payload]
                }else {
                    return Object.assign({}, action.payload)
                }  
            }
            return action.payload
        } 
        return state
    }
}