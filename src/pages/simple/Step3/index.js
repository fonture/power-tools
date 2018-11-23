import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import UnPartake from './UnPartake'
import Partake from './Partake'
import './index.less'
import { report } from '../../../utils'
import inject from '../../../utils/inject'
@inject('baseMessage')
export default class Step3 extends Component {
    componentDidMount() {
        const { onDidMount } = this.props;
        onDidMount(this._rendered.dom);
    }
    render() {
        const { mart } = this.props.baseMessage;
        return (
            <View>
                {
                    mart === '参与' ?
                        <Partake /> :
                        <UnPartake />
                }
            </View>
        )
    }
}