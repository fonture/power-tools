import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View } from '@tarojs/components'
import ElectricityCost from './ElectricityCost'
import BuyPowerCost from './BuyPowerCost'
import request from '../../../utils/request'
import './index.less'

export default class Step2 extends Component {
    static propTypes = {
        join: PropTypes.bool
    }
    static defaultProps = {
        join: true
    }
    async componentDidMount() {
        this.props.didMount(this._rendered.dom)
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
        const { join } = this.props
        return (
            <View>
            {
                join
                ? <BuyPowerCost />
                : <ElectricityCost />
            }
            </View>
        )
    }
}