/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:11:35 
 * @Description:未参与市场时的用电成本
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-04 09:36:54
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
import PowerProportion from '../../../../components/PowerProportion'
import { powerAveragePriceOfNotJoin } from '../../../../utils/formula'
import reduxHelper from '../../../../utils/reduxHelper'
import inject from '../../../../utils/inject'
import Input from '../../../../components/Input'
import './index.less'

@inject('newestCataloguePrice', 'electricityCostData', 'firePrice')
export default class ElectricityCost extends Component {
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
        const { yearPower, averagePrice, high, medium, low, method } = this.state
        if((yearPower && averagePrice && method === '电度电价') || (high && medium && low)){
            reduxHelper('next', true)
        }else{
            reduxHelper('next', false)
        }
    }
    componentDidMount(){
        reduxHelper('electricityCostData', this.state)
    }
    componentWillUnmount() {
        const { yearPower, averagePrice, high, medium, low } = this.state
        reduxHelper('powerCosts', { yearPower, averagePrice, high, medium, low })
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
        if(this.state.method === e.target.innerHTML) {
            this.setState({
                isOpened: false
            })
            return
        }
        this.setState({
            method: e.target.innerHTML,
            isOpened: false,
        }, () => {
            reduxHelper('electricityCostData', this.state)
            const { yearPower, averagePrice, high, medium, low, method } = this.state
            if((yearPower && averagePrice && method === '电度电价') || (high && medium && low)){
                reduxHelper('next', true)
            }else{
                reduxHelper('next', false)
            }
        })
    }
    /**
     * @description 峰平谷输入框值改变的时候调用
     * @param {String} type 峰平谷的标识，high为峰，medium为平， low为谷
     * @param {String} value 输入框的值
     */
    onChangeValue = (type, value) => {
        // const val = +value
        const { newestCataloguePrice: {cataloguePriceVoMap: {peak, plain, valley}, collectionFund} } = this.props
        const values = Object.assign({}, this.state, {[type]: value})
        let result = {}
        if(this.state.method === '用电量') {
            let { high, medium, low } = values
            high = high === '' ? 0 : high
            medium = medium === '' ? 0 : medium
            low = low === '' ? 0 : low
            result = powerAveragePriceOfNotJoin(high, medium, low, peak.price, plain.price, valley.price, collectionFund)
        }
        this.setState({
            ...values,
            ...result,
            isOpened: false
        }, () => {
            reduxHelper('electricityCostData', this.state)
            const { yearPower, averagePrice, high, medium, low, method } = this.state
            if((yearPower && averagePrice && method === '电度电价') || (high && medium && low)){
                reduxHelper('next', true)
            }else{
                reduxHelper('next', false)
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

    handleClose = ()=> {
        this.setState({
            isOpened: false
        })
    }
    render() {
        const { high, medium, low, method, yearPower, averagePrice, isOpened, inputYearPower, inputAveragePrice } = this.state
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
                            className="card-group"
                            title="峰平谷比例"
                            isFull
                        >
                            {/* <View className="at-row at-row__justify--center at-row__align--center">
                            {
                                items.map(item => {
                                    const { percent, value, itemName } = item
                                    return <PowerProportion percent={percent} value={value} itemName={itemName} showPercent={true} onChangeValue={this.onChangeValue.bind(this)}/>
                                })
                            }    
                            </View> */}
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