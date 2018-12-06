/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:12:20 
 * @Description: 第二步入口文件
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-06 19:29:47
 */
import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View } from '@tarojs/components'
import ElectricityCost from './ElectricityCost'
import BuyPowerCost from './BuyPowerCost'
import inject from '../../../utils/inject';
import './index.less'

@inject('baseMessage')
export default class Step2 extends Component {
    static propTypes = {
        baseMessage: PropTypes.object.isRequired
    }
    static defaultProps = {
        baseMessage: {
            adsWord: '',
            mart: '',
            sort: []
        }
    }

    async componentDidMount() {
        this.props.onDidMount(this._rendered.dom);
    }    
    render() {
        const { baseMessage } = this.props
        return (
            <View>
            {
                baseMessage.mart === '参与'
                ? <BuyPowerCost />
                : <ElectricityCost />
            }
            </View>
        )
    }
}