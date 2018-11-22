import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UnPartake from './UnPartake'
import Partake from './Partake'
import './index.less'

export default class Step3 extends Component {
    componentDidMount() {
        this.props.didMount(this._rendered.dom);
    }    
    render() {
        return (
            <View>
                <Partake />
            </View>
        )
    }
}