import Taro, { Component } from '@tarojs/taro'
import '@tarojs/async-await'
import { Provider } from '@tarojs/redux'
import configStore from './store'
import initialState from './store/initState'
import Index from './pages/index'

import './app.less'

const store = configStore(initialState)

if (process.env.TARO_ENV === "weapp") {
  require("taro-ui/dist/weapp/css/index.css")
} else if (process.env.TARO_ENV === "h5") {
  require("taro-ui/dist/h5/css/index.css")
}
class App extends Component {

  config = {
    pages: [
      'pages/index',
      'pages/simple/index',
      'pages/higher/index',
      'pages/result/index',
      'pages/resultCanvas/index'
    ],
    window: {
      backgroundTextStyle: 'light',
      navigationBarBackgroundColor: '#262828',
      navigationBarTitleText: '购电小工具',
      navigationBarTextStyle: 'black'
    }
  }

  componentDidMount() {
    document.getElementById('app').style.height = window.innerHeight + 'px';
  }

  componentDidShow() { }

  componentDidHide() { }

  componentDidCatchError() { }

  // 在 App 类中的 render() 函数没有实际作用
  // 请勿修改此函数
  render() {
    return (
      <Provider store={store}>
        <Index />
      </Provider>
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
