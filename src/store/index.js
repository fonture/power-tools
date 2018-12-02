/*
 * @Author: ouyangdc
 * @Date: 2018-11-15 09:04:57
 * @Description: redux数据仓库
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-01 14:09:33
 */
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'
import createAction from '../utils/createAction'
import createReducer from '../utils/createReducer'

const middlewares = [
  thunkMiddleware,
  createLogger()
]

let store = {}

const createInitReducer = (initialState) => {
    for(let key in initialState) {
        const type = Symbol.for(key.toString())
        const reducer = createReducer(type, initialState[key])
        injectReducer(key, reducer)
    }
}

export default function configStore (initialState = {}) {
    store = createStore(rootReducer(), applyMiddleware(...middlewares))
    store.asyncReducers = {}
    createInitReducer(initialState)
    return store
}


export function injectReducer(name, asyncReducer) {
    if(store.asyncReducers.hasOwnProperty(name)) return
    store.asyncReducers[name] = asyncReducer
    store.replaceReducer(rootReducer(store.asyncReducers))
}

export { store }
