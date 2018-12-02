/*
 * @Author: ouyangdc 
 * @Date: 2018-11-15 10:48:50 
 * @Description: reducer入口文件
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-30 13:54:48
 */
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

export default (asyncReducers) => {
    return combineReducers({
        routing: routerReducer,
        ...asyncReducers
    })
}
