import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

export default class Step1 extends Component {
    componentDidMount() {
        this.props.onDidMount(this._rendered.dom);
    }
    render() {
        return (<View>
            <Text>高级版基本信息</Text>
        </View>)
    }
}