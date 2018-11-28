/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:11:35 
 * @Description:未参与市场时的用电成本
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-28 19:01:15
 */

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { 
    AtList, 
    AtListItem, 
    AtActionSheet, 
    AtActionSheetItem, 
    AtCard, 
    AtInput,
} from 'taro-ui'
import PowerProportion from '../../../../components/PowerProportion'
import { powerAveragePriceOfNotJoin } from '../../../../utils/formula'
import reduxHelper from '../../../../utils/reduxHelper'
import inject from '../../../../utils/inject'
import './index.less'

@inject('newestCataloguePrice', 'electricityCostData')
export default class ElectricityCost extends Component {
    state = {
        isOpened: this.props.electricityCostData.isOpened || false,
        method: this.props.electricityCostData.method || '用电量',
        high: this.props.electricityCostData.high || 0,
        medium: this.props.electricityCostData.medium || 0,
        low: this.props.electricityCostData.low || 0,
        yearPower: this.props.electricityCostData.yearPower || 0,
        averagePrice: this.props.electricityCostData.averagePrice || 0,
    }
    defaultProps = {
        electricityCostData: {},
        newestCataloguePrice: {
            cataloguePriceVoMap: {
                peak: {price: 0}, 
                plain: {price: 0}, 
                valley: {price: 0}
            }, 
            collectionFund: 0
        }
    }
    componentDidMount(){
        reduxHelper('electricityCostData', this.state)
    }
    componentWillUnmount() {
        const { yearPower, averagePrice } = this.state
        reduxHelper('powerCosts', { yearPower, averagePrice })
    }

    /**
     * @description 点击输入方式时显示底部活动页
     */
    onToggleInputMethod = () => {
        this.setState({
            isOpened: true
        }, () => {
            reduxHelper('electricityCostData', this.state)
        })
    }
    /**
     * @description 底部活动项的点击事件
     * @param {Object} e 事件对象
     */
    onClickSheet = (e) => {
        if(this.state.method === e.target.innerHTML) return
        this.setState({
            method: e.target.innerHTML,
            isOpened: false,
            high: 0,
            medium: 0,
            low: 0,
            yearPower: 0, 
            averagePrice: 0
        }, () => {
            reduxHelper('electricityCostData', this.state)
        })
    }
    /**
     * @description 峰平谷输入框值改变的时候调用
     * @param {String} type 峰平谷的标识，high为峰，medium为平， low为谷
     * @param {String} value 输入框的值
     */
    onChangeValue = (type, value) => {
        const val = +value
        const { newestCataloguePrice: {cataloguePriceVoMap: {peak, plain, valley}, collectionFund} } = this.props
        if(!isNaN(val)){
            const values = Object.assign({}, this.state, {[type]: val})
            const { high, medium, low } = values
            const result = powerAveragePriceOfNotJoin(high, medium, low, peak.price, plain.price, valley.price, collectionFund)
            this.setState({
                ...values,
                ...result,
                isOpened: false
            }, () => {
                reduxHelper('electricityCostData', this.state)
            })
        }
    }
    /**
     * @description 点击每一个列表项时将光标聚集到该行的输入框中
     * @param {Object} e 事件对象
     */
    onListClick = (e) => {
        e.currentTarget.getElementsByTagName('input')[0].focus()
    }

    /**
     * @description 电度电价输入事件
     * @param {String} name 变量名
     * @param {Number} value 变量值
     */
    onInput = (name, value) => {
        const val = +value
        const values = Object.assign({}, this.state, {[name]: val})
        if(!isNaN(val)){
            this.setState({
                ...values
            }, () => {
                reduxHelper('electricityCostData', this.state)
            })    
        }
    }

    render() {
        const { high, medium, low, method, yearPower, averagePrice} = this.state
        const items = [
            {
                percent: yearPower && (high * 100 / yearPower).toFixed(2) + '%', 
                value: high, 
                itemName: '峰'
            }, {
                percent: yearPower && (medium * 100 / yearPower).toFixed(2) + '%', 
                value: medium, 
                itemName: '平'
            }, {
                percent: yearPower && (low * 100 / yearPower).toFixed(2) + '%', 
                value: low, 
                itemName: '谷'
            }
        ]
        return (
            <View className="power-cost electricity-cost">

                {/* 选择输入方式 */}
                <AtList className="card-group input-method">
                    <AtListItem title="输入方式" arrow='right' extraText={this.state.method} onClick={this.onToggleInputMethod}/>
                </AtList>

                {/* 选择输入方式时底部弹出的活动页 */}
                <AtActionSheet isOpened={this.state.isOpened} title="请选择输入方式">
                    <AtActionSheetItem onClick={this.onClickSheet}>
                    用电量
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={this.onClickSheet}>
                    电度电价
                    </AtActionSheetItem>
                </AtActionSheet>

                {
                    method === '用电量'
                    ? <View>
                        {/* 峰平谷比例 */}
                        <AtCard
                            className="card-group"
                            title="峰平谷比例"
                            isFull
                        >
                            <View className="at-row at-row__justify--center at-row__align--center">
                            {
                                items.map(item => {
                                    const { percent, value, itemName } = item
                                    return <PowerProportion percent={percent} value={value} itemName={itemName} onChangeValue={this.onChangeValue.bind(this)}/>
                                })
                            }    
                            </View>
                        </AtCard>

                        {/* 展示年度电量与用电均价 */}
                        <AtList className="card-group power-result-list">
                            <AtListItem title="年度用电量" extraText={<span>{yearPower}<span className="power-result-unit">万千瓦时</span></span>} />
                            <AtListItem title="用电均价" extraText={<span>{averagePrice}<span className="power-result-unit">元/千瓦时</span></span>} />
                        </AtList>
                    </View>
                    : <AtList className="card-group power-input-self">
                        <AtListItem title="年度用电量"  onClick={this.onListClick}
                            extraText={
                                <View className="at-row at-row__justify--center at-row__align--center">
                                    <AtInput type="number" className="power-input" border={false} value={yearPower} onChange={this.onInput.bind(this, 'yearPower')}/>
                                    <div className="power-result-unit">万千瓦时</div>
                                </View>
                            } 
                        />
                        <AtListItem title="用电均价"  onClick={this.onListClick}
                            extraText={
                                <View className="at-row at-row__justify--center at-row__align--center">
                                    <AtInput type="number" className="power-input" border={false} value={averagePrice} onChange={this.onInput.bind(this, 'averagePrice')}/>
                                    <div className="power-result-unit">元/千瓦时</div>
                                </View>
                            } 
                        />
                    </AtList>
                }
            </View>
        )
    }
}