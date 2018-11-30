/*
 * @Author: ouyangdc 
 * @Date: 2018-11-15 10:00:04 
 * @Description: 动态生成action
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-29 17:24:06
 */
export default (type, args) => {
    let action = { 
        type,
        payload: args
    }
    return action
}