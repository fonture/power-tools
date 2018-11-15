import Taro, { Component } from '@tarojs/taro'

let store = null;

class Store {
    data = {}
    result = {}
    setData = newData => {
        this.data = newData;
    }
    setResult = newResult => {
        this.result = newResult;
    }
}

export const withStore = (Comp) => {
    return class Hcmp extends Component {
        render() {
            return <Comp store={store} {...this.props}/>
        }
    }
}

export const initStore = () => {
    store = new Store();
}