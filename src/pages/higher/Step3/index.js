import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

export default class Step3 extends Component {
  componentDidMount() {
    console.log(this);
    this.props.onDidMount(this._rendered.dom);
  }
  render() {
    return (
      <View>
        todo todo todo
      </View>
    )
  }
}
