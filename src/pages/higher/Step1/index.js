import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Step1 from '../../simple/Step1';

export default class Steph1 extends Component {
    render() {
        return (<View>
            <Step1 version='higher' onDidMount={this.props.onDidMount} />
        </View>)
    }
}