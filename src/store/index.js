/*
 * @Author: ouyangdc 
 * @Date: 2018-11-15 09:04:57 
 * @Description: redux数据仓库
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-22 17:25:08
 */
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer from '../reducers'

const middlewares = [
  thunkMiddleware,
  createLogger()
]

const reducers = rootReducer()

let store = {}

export default function configStore (initialState = {}) {
  store = createStore(reducers, initialState, applyMiddleware(...middlewares))
  store.asyncReducers = {}
  return store
}

export function injectReducer(name, asyncReducer) {
    store.asyncReducers[name] = asyncReducer
    store.replaceReducer(rootReducer(store.asyncReducers))
}

export { store }