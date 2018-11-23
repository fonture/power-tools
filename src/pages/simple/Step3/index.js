import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UnPartake from './UnPartake'
import Partake from './Partake'
import './index.less'
import { report } from '../../../utils'
export default class Step3 extends Component {
    componentDidMount() {
        const { onDidMount } = this.props;
        onDidMount(this._rendered.dom);
    }
    render() {
        return (
            <View>
                <UnPartake />
            </View>
        )
    }
}