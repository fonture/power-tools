/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:11:35 
 * @Description:未参与市场时的用电成本
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-23 17:15:00
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
import PowerProportion from './PowerProportion'
import { powerAveragePriceOfNotJoin } from '../../../../utils/formula'
import './index.less'

export default class ElectricityCost extends Component {
    state = {
        isOpened: false,
        method: '用电量',
        high: 0,
        medium: 0,
        low: 0,
        highPrice: 0.8234,
        mediumPrice: 0.5234,
        lowPrice: 0.3324,
        yearPower: 0, 
        averagePrice: 0
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
        })
    }
    /**
     * @description 峰平谷输入框值改变的时候调用
     * @param {String} type 峰平谷的标识，high为峰，medium为平， low为谷
     * @param {String} value 输入框的值
     */
    onChangeValue = (type, value) => {
        value = +value
        if(!isNaN(value)){
            const values = Object.assign({}, this.state, {[type]: value})
            const { high, medium, low, highPrice, mediumPrice, lowPrice } = values
            const result = powerAveragePriceOfNotJoin(high, medium, low, highPrice, mediumPrice, lowPrice, 0.5423)
            this.setState({
                ...values,
                ...result
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
        if(!isNaN(val)){
            this.setState({
                [name]: val
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
            <View className="electricity-cost">

                {/* 选择输入方式 */}
                <AtList className="input-method">
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
                            title="峰平谷比例"
                            isFull
                        >
                            <View className="at-row at-row__justify--center at-row__align--center">
                            {
                                items.map(item => {
                                    const { percent, value, itemName } = item
                                    return <PowerProportion percent={percent} value={value} itemName={itemName} onChangeValue={this.onChangeValue}/>
                                })
                            }    
                            </View>
                        </AtCard>

                        {/* 展示年度电量与用电均价 */}
                        <AtList className="power-result-list">
                            <AtListItem title="年度用电量" extraText={<span>{yearPower ? yearPower : ''}<span className="power-result-unit">万千瓦时</span></span>} />
                            <AtListItem title="用电均价" extraText={<span>{averagePrice ? averagePrice : ''}<span className="power-result-unit">元/千瓦时</span></span>} />
                        </AtList>
                    </View>
                    : <AtList className="power-input-self">
                        <AtListItem title="年度用电量"  onClick={this.onListClick}
                            extraText={
                                <View className="at-row at-row__justify--center at-row__align--center">
                                    <AtInput type="number" className="power-input" border={false} value={yearPower ? yearPower : ''} onChange={this.onInput.bind(this, 'yearPower')}/>
                                    <div className="power-result-unit">万千瓦时</div>
                                </View>
                            } 
                        />
                        <AtListItem title="用电均价"  onClick={this.onListClick}
                            extraText={
                                <View className="at-row at-row__justify--center at-row__align--center">
                                    <AtInput type="number" className="power-input" border={false} value={averagePrice ? averagePrice : ''} onChange={this.onInput.bind(this, 'averagePrice')}/>
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