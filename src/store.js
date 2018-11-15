import Taro, { Component } from '@tarojs/taro'

let store = null;

class Store {
    data = {}
    result = {}
    getStore = key => {
        return JSON.parse(JSON.stringify(this[key]))
    }
    setStore = (key, value) => {
        this[key] = value;
    }
}

export const withStore = (Comp) => {
    return class Hcmp extends Component {
        render() {
            return <Comp store={store} {...this.props} />
        }
    }
}

export const initStore = () => {
    store = new Store();
}