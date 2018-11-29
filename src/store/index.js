/*
 * @Author: ouyangdc
 * @Date: 2018-11-15 09:04:57
 * @Description: redux数据仓库
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-29 16:31:57
 */
import { createStore, applyMiddleware } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import rootReducer, { createInitReducer } from '../reducers'
import initialState from './initState';

const middlewares = [
  thunkMiddleware,
  createLogger()
]

// const reducers = rootReducer()

let store = {}

export default function configStore () {
  createInitReducer(initialState)
  store = createStore(rootReducer(), applyMiddleware(...middlewares))
  store.asyncReducers = {}
  return store
}

export function injectReducer(name, asyncReducer) {
    store.asyncReducers[name] = asyncReducer
    store.replaceReducer(rootReducer(store.asyncReducers))
}

export { store }
