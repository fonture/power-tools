/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:12:20 
 * @Description: 第二步入口文件
 * @Last Modified by:   ouyangdc 
 * @Last Modified time: 2018-11-23 16:12:20 
 */
import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View } from '@tarojs/components'
import ElectricityCost from './ElectricityCost'
import BuyPowerCost from './BuyPowerCost'
import request from '../../../utils/request'
import inject from '../../../utils/inject';
import './index.less'

@inject('baseMessage')
export default class Step2 extends Component {
    static propTypes = {
        join: PropTypes.bool
    }
    static defaultProps = {
        join: true
    }
    async componentDidMount() {
        this.props.onDidMount(this._rendered.dom);
        const result = await request({
            method: 'GET',
            url: '/wechat/kit/catalogueprice/year',
            data: {
                tradeCenter: 'sichuan', 
                category: 'a',
                voltage: 'a'
            }
        })
        console.log(result)
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