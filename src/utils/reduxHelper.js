/*
 * @Author: ouyangdc 
 * @Date: 2018-11-15 10:03:25 
 * @Description: 封装redux数据流
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-15 11:28:06
 */
import createAction from './createAction'
import {injectReducer} from '../store'
import createReducer from './createReducer'
import { store } from '../store'
export default (argsName, args) => {
    // 创建action
    const type = Symbol()
    const action = createAction(type, args)

    // 动态合并reducer
    injectReducer(argsName, createReducer(type))

    // 触发action
    store.dispatch(action)
}
