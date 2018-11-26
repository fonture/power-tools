/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:12:20 
 * @Description: 第二步入口文件
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-26 14:43:38
 */
import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View } from '@tarojs/components'
import ElectricityCost from './ElectricityCost'
import BuyPowerCost from './BuyPowerCost'
import request from '../../../utils/request'
import inject from '../../../utils/inject';
import reduxHelper from '../../../utils/reduxHelper'
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
        
        // 请求基金
        const catalogueprice = await request({
            method: 'GET',
            url: '/wechat/kit/catalogueprice/year',
            data: {
                tradeCenter: 'sichuan', 
                category: 'a',
                voltage: 'a'
            }
        })
        
        // 请求输配电价
        const transmissionprice = await request({
            method: 'GET',
            url: '/wechat/kit/transmissionprice/year',
            data: {
                tradeCenter: 'sichuan', 
                category: 'a',
                voltage: 'a'
            }
        })
        
        catalogueprice && catalogueprice.data && reduxHelper('newestCataloguePrice', {...catalogueprice.data.newestCataloguePrice})
        transmissionprice && transmissionprice.data && reduxHelper('newestTransmissionPrice', transmissionprice.data.newestTransmissionPrice)
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