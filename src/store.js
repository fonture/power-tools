import Taro, { Component } from '@tarojs/taro'

let store = null;
let method = {
    getStore(key) {
        return JSON.parse(JSON.stringify(store[key]))
    },
    setStore(key, value) {
        store[key] = value;
    }
}
class Store {
    data = {}
    result = {}
}

export const withStore = (Comp) => {
    return class Hcmp extends Component {
        render() {
            return <Comp store={method} {...this.props} />
        }
    }
}

export const initStore = () => {
    store = new Store();
}