/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:11:35 
 * @Description: 简单版 -- 第二步 -- 用电成本
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-06 16:18:02
 */

import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { 
    AtList, 
    AtListItem, 
    AtActionSheet, 
    AtActionSheetItem, 
    AtCard, 
} from 'taro-ui'
import { powerAveragePriceOfNotJoin } from '../../../../utils/formula'
import reduxHelper from '../../../../utils/reduxHelper'
import inject from '../../../../utils/inject'
import Input from '../../../../components/Input'
import './index.less'

@inject('newestCataloguePrice', 'electricityCostData', 'firePrice', 'reLocateButton')
export default class ElectricityCost extends Component {
    // 初始化的state要从redux中获取，以便点了“上一步”或者“下一步”再回来时数据还在
    state = {
        isOpened: false,
        method: this.props.electricityCostData.method,
        high: this.props.electricityCostData.high,
        medium: this.props.electricityCostData.medium,
        low: this.props.electricityCostData.low,
        yearPower: this.props.electricityCostData.yearPower,
        averagePrice: this.props.electricityCostData.averagePrice,
        inputYearPower: this.props.electricityCostData.inputYearPower,
        inputAveragePrice: this.props.electricityCostData.inputAveragePrice,
    }
    componentWillMount() {
        const { high, medium, low, method, inputAveragePrice, inputYearPower } = this.state
        /**
         * 判断初始化时组件中的数据是否为有效数据。如果有效，则“下一步”按钮默认可点击，否则不可点击
         * 如果当前的输入方式是年度用电量，则需要判断峰、平、谷的值是否有效
         * 如果当前的输入方式是电度电价，则需要判断年度用电量、电度电价的值是否有效
         **/
        if(method === '电度电价') {
            if(inputAveragePrice && inputYearPower) {
                reduxHelper('next', true)
            } else {
                reduxHelper('next', false)
            }
        } else {
            if(high && medium && low) {
                reduxHelper('next', true)
            } else {
                reduxHelper('next', false)
            }
        }
    }
    componentDidUpdate(){
        this.props.reLocateButton()
    }
    /**
     * @description 组件卸载时，需要将报告中需要的数据存在powerCosts中
     */
    componentWillUnmount() {
        const { yearPower, averagePrice, high, medium, low, inputAveragePrice, inputYearPower, method } = this.state
        let tempYearPower = 0, tempAveragePrice = 0
        if(method === '电度电价') {
            tempYearPower = inputYearPower
            tempAveragePrice = inputAveragePrice
        }else {
            tempYearPower = yearPower
            tempAveragePrice = averagePrice
        }
        reduxHelper('powerCosts', { yearPower: tempYearPower, averagePrice: tempAveragePrice, high, medium, low })
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
        // 如果选择的项就是当前所在的，则将sheet隐藏即可
        if(this.state.method === e.target.innerHTML) {
            this.setState({
                isOpened: false
            })
            return
        }
        // 如果选择的项不是当前所在的，则需要更新method的值
        this.setState({
            method: e.target.innerHTML,
            isOpened: false,
        }, () => {
            reduxHelper('electricityCostData', this.state)
            const { inputAveragePrice, inputYearPower, high, medium, low, method } = this.state
            if(method === '电度电价') {
                if(inputAveragePrice && inputYearPower) {
                    reduxHelper('next', true)
                } else {
                    reduxHelper('next', false)
                }
            } else {
                if(high && medium && low) {
                    reduxHelper('next', true)
                } else {
                    reduxHelper('next', false)
                }
            }
        })
    }
    /**
     * @description 峰平谷输入框值改变的时候调用
     * @param {String} type 峰平谷的标识，high为峰，medium为平， low为谷
     * @param {String} value 输入框的值
     */
    onChangeValue = (type, value) => {
        const { newestCataloguePrice: {cataloguePriceVoMap: {peak, plain, valley}, collectionFund} } = this.props
        
        // values里的值是经过更改后的最新的值
        const values = Object.assign({}, this.state, {[type]: value})
        let result = {}

        // 如果当前输入方式是用电量，则需要重新计算总电量和用电均价
        if(this.state.method === '用电量') {
            let { high, medium, low } = values
            result = powerAveragePriceOfNotJoin(high, medium, low, peak.price, plain.price, valley.price, collectionFund)
        }
        this.setState({
            ...values,
            ...result,
            isOpened: false
        }, () => {
            reduxHelper('electricityCostData', this.state)
            const { inputAveragePrice, inputYearPower, high, medium, low, method } = this.state
            if(method === '电度电价') {
                if(inputAveragePrice && inputYearPower) {
                    reduxHelper('next', true)
                } else {
                    reduxHelper('next', false)
                }
            } else {
                if(high && medium && low) {
                    reduxHelper('next', true)
                } else {
                    reduxHelper('next', false)
                }
            }
        })
    }
    /**
     * @description 点击每一个列表项时将光标聚集到该行的输入框中
     * @param {Object} e 事件对象
     */
    onListClick = (e) => {
        e.currentTarget.getElementsByTagName('input')[0].focus()
    }
    /**
     * @description 底部活动页的关闭事件
     */
    handleClose = ()=> {
        this.setState({
            isOpened: false
        })
    }
    render() {
        const { high, medium, low, method, yearPower, averagePrice, isOpened, inputYearPower, inputAveragePrice } = this.state
        return (
            <View className="power-cost electricity-cost">

                {/* 选择输入方式 */}
                <AtList className="card-group input-method">
                    <AtListItem title="输入方式" arrow='right' extraText={this.state.method} onClick={this.onToggleInputMethod}/>
                </AtList>

                {/* 选择输入方式时底部弹出的活动页 */}
                <AtActionSheet isOpened={isOpened} title="请选择输入方式" onClose={this.handleClose}>
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
                            className="card-group power-input-list"
                            title="峰平谷比例"
                            isFull
                        >
                            <AtList className="">
                                <AtListItem title="峰时用电" onClick={this.onListClick}
                                    extraText={
                                        <View className="at-row at-row__justify--center at-row__align--center">
                                            <Input type="number" digit={4}  className="power-input" border={false} value={high} onChange={this.onChangeValue.bind(this, 'high')}/>
                                            <div className="power-result-unit">万千瓦时</div>
                                        </View>
                                    } 
                                />
                                <AtListItem title="平时用电" onClick={this.onListClick}
                                    extraText={
                                        <View className="at-row at-row__justify--center at-row__align--center">
                                            <Input type="number" digit={4} className="power-input" border={false} value={medium} onChange={this.onChangeValue.bind(this, 'medium')}/>
                                            <div className="power-result-unit">万千瓦时</div>
                                        </View>
                                    } 
                                />
                                <AtListItem title="谷时用电" onClick={this.onListClick}
                                    extraText={
                                        <View className="at-row at-row__justify--center at-row__align--center">
                                            <Input type="number" digit={4} className="power-input" border={false} value={low} onChange={this.onChangeValue.bind(this, 'low')}/>
                                            <div className="power-result-unit">万千瓦时</div>
                                        </View>
                                    } 
                                />
                            </AtList>
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
                                    <Input type="number" digit={4} className="power-input" border={false} value={inputYearPower} onChange={this.onChangeValue.bind(this, 'inputYearPower')}/>
                                    <div className="power-result-unit">万千瓦时</div>
                                </View>
                            } 
                        />
                        <AtListItem title="用电均价"  onClick={this.onListClick}
                            extraText={
                                <View className="at-row at-row__justify--center at-row__align--center">
                                    <Input type="number" digit={5} className="power-input" border={false} value={inputAveragePrice} onChange={this.onChangeValue.bind(this, 'inputAveragePrice')}/>
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