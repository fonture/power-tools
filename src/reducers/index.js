/*
 * @Author: ouyangdc 
 * @Date: 2018-11-15 10:48:50 
 * @Description: reducer入口文件
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-29 17:36:35
 */
import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'

const initialReducerArr = {}
export const createInitReducer = (initialState) => {
    for(let key in initialState) {
        initialReducerArr[key] = (state = initialState[key]) => state
    }
}

export default (asyncReducers) => {
    return combineReducers({
        routing: routerReducer,
        ...initialReducerArr,
        ...asyncReducers
    })
}
