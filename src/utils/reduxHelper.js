/*
 * @Author: ouyangdc 
 * @Date: 2018-11-15 10:03:25 
 * @Description: 封装redux数据流
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-04 17:30:00
 */
import createAction from './createAction'
import {injectReducer} from '../store'
import createReducer from './createReducer'
import { store } from '../store'
export default (argsName, args) => {
    // 创建action
    const type = Symbol.for(argsName)
    const action = createAction(type, args)

    // 动态合并reducer
    let initState = {}
    const argType = typeof args
    switch(argType) {
        case 'number':
            initState = 0
            break
        case 'string': 
            initState = ''
            break
        case 'boolean': 
            initState = true
            break
        default:
            if(Array.isArray(args)){
                initState = []
            }else {
                initState = {}
            }
            break
    }
    injectReducer(argsName, createReducer(type, initState))

    // 触发action
    store.dispatch(action)
}
