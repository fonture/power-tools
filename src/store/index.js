/*
 * @Author: ouyangdc
 * @Date: 2018-11-15 09:04:57
 * @Description: redux数据仓库
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-30 15:35:23
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
        const reducer = (state = initialState[key]) => state
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
    store.asyncReducers[name] = asyncReducer
    store.replaceReducer(rootReducer(store.asyncReducers))
}

export { store }
