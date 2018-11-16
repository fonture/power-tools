/*
 * @Author: ouyangdc 
 * @Date: 2018-11-15 11:28:43 
 * @Description: 动态创建reducer
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-15 13:56:19
 */
export default (type) => (state = {}, action) => {
    if (type === action.type) {
        return Object.assign({}, state, {
            ...action.payload
        })
    } 
    return state
}