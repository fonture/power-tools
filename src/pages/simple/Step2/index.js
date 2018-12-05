/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:12:20 
 * @Description: 第二步入口文件
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-05 09:22:25
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
        const { adsWord, sort } = this.props.baseMessage
        
        // 请求基金、峰平谷电价
        const catalogueprice = await request({
            method: 'GET',
            url: '/wechat/kit/catalogueprice/year',
            data: {
                tradeCenter: adsWord, 
                category: sort[0],
                voltage: sort[1]
            }
        })
        
        // 请求输配电价
        const transmissionprice = await request({
            method: 'GET',
            url: '/wechat/kit/transmissionprice/year',
            data: {
                tradeCenter: adsWord, 
                category: sort[0],
                voltage: sort[1]
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