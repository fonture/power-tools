import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Step1 from '../../simple/Step1';

export default class Steph1 extends Component {
    componentDidMount() {
        this.props.onDidMount(this._rendered.dom);
    }
    render() {
        return (<View>
            <Step1 />
        </View>)
    }
}