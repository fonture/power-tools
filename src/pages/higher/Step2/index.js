/*
 * @Author: ouyangdc 
 * @Date: 2018-11-28 13:47:30 
 * @Description: 高级版第二步用电成本
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-06 16:14:35
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { 
    AtList, 
    AtListItem, 
    AtCard,
} from 'taro-ui'
import request from '../../../utils/request'
import inject from '../../../utils/inject'
import reduxHelper from '../../../utils/reduxHelper'
import { computePowerOfHigh } from '../../../utils/formula'
import { keepDecimal } from '../../../utils'
import Proportion from '../../../components/Proportion'
import MonthPlugin from '../MonthPlugin'
import Input from '../../../components/Input'
import './index.less'

@inject('baseMessage', 'catalogueprice', 'powerCostsOfHigh', 'reLocateButton')
export default class Step2 extends Component {
    state = {
        currMonth: this.props.powerCostsOfHigh.currMonth,
        monthPowerList: this.props.powerCostsOfHigh.monthPowerList,
        yearPower: this.props.powerCostsOfHigh.yearPower,
        averagePrice: this.props.powerCostsOfHigh.averagePrice,
        highYearPower:this.props.powerCostsOfHigh.highYearPower,
        mediumYearPower: this.props.powerCostsOfHigh.mediumYearPower, 
        lowYearPower: this.props.powerCostsOfHigh.lowYearPower,
    }
    componentWillMount() {
        const next = this.state.monthPowerList.find(item => item.finished)
        reduxHelper('next', next ? true : false)  
    }
    async componentDidMount(){
        const { baseMessage } = this.props
        const { adsWord, sort } = baseMessage

        // 将焦点聚焦到第一个输入框
        this._rendered.dom.querySelector('.power-input').querySelector('input').focus()

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
        // 基金、峰平谷电价
        catalogueprice && catalogueprice.data && reduxHelper('catalogueprice', catalogueprice.data)
        // 输配电价
        transmissionprice && transmissionprice.data && reduxHelper('transmissionprice', transmissionprice.data)
    }
    componentDidUpdate() {
        this.props.reLocateButton()
    }
    componentWillUnmount() {
        reduxHelper('powerCostsOfHigh', this.state)
    }

    /**
     * @description 峰平谷输入框值改变的时候调用
     * @param {String} type 峰平谷的标识，high为峰，medium为平， low为谷
     * @param {String} value 输入框的值
     */
    onChangeValue = (type, value) => {
        const { currMonth, monthPowerList } = this.state
        const { catalogueprice: { yearCataloguePriceMap } } = this.props
        const values = Object.assign({}, monthPowerList[currMonth - 1], {[type]: value})
        const { high, medium, low } = values
        monthPowerList[currMonth - 1] = {
            ...values,
            finished: high || medium || low ? true : false
        }
        const result = computePowerOfHigh(monthPowerList, yearCataloguePriceMap)
        this.setState({
            ...result
        }, () => {
            const next = this.state.monthPowerList.find(item => item.finished)
            reduxHelper('next', next ? true : false)     
        })
    }

    /**
     * @description 点击月份
     * @param {Number} currMonth 当前点击的月份
     */
    onClickMonth = (currMonth) => {
        this.setState({
            currMonth
        })
        this._rendered.dom.querySelector('.power-input').querySelector('input').focus()
    }
    render() {
        const { currMonth, monthPowerList, yearPower, averagePrice, lowYearPower, mediumYearPower, highYearPower } = this.state
        const data = monthPowerList[currMonth - 1]
        const items = []
        if(yearPower) {
            const highPercent = keepDecimal((highYearPower || 0) * 100 / yearPower, 2)
            const mediumPercent = keepDecimal((mediumYearPower || 0) * 100 / yearPower, 2)
            const lowPercent = keepDecimal(100 - highPercent - mediumPercent, 2)
            items.push(highPercent)
            items.push(mediumPercent)
            items.push(lowPercent)
        }
        return (
            <View className="elec-cost-high">
            
                {/* 月份操作区 */}
                <MonthPlugin title="用电成本" data={this.state.monthPowerList} onClick={this.onClickMonth.bind(this)} current={this.state.currMonth}/>

                {/* 峰平谷电量输入区 */}
                <AtCard
                    isFull
                    title={`${currMonth}月数据`}
                    className="noPadding"
                >
                    <AtList>
                        <AtListItem title="峰时用电" extraText={
                            <View className="at-row at-row__justify--center at-row__align--center">
                                <Input type="number" className="power-input" digit={4} border={false} value={data.high} maxlength={5} onChange={this.onChangeValue.bind(this, 'high')}/>
                                <div className="unit">万千瓦时</div>
                            </View>
                        } />
                        <AtListItem title="平时用电" extraText={
                            <View className="at-row at-row__justify--center at-row__align--center">
                                <Input type="number" className="power-input" digit={4} border={false} value={data.medium} onChange={this.onChangeValue.bind(this, 'medium')}/>
                                <div className="unit">万千瓦时</div>
                            </View>
                        } />
                        <AtListItem title="谷时用电" extraText={
                            <View className="at-row at-row__justify--center at-row__align--center">
                                <Input type="number" className="power-input" digit={4} border={false} value={data.low} onChange={this.onChangeValue.bind(this, 'low')}/>
                                <div className="unit">万千瓦时</div>
                            </View>
                        } />                    
                    </AtList>
                </AtCard>

                {/* 结果展示区 */}
                <AtList className="at-card result-panel">
                    <AtListItem title="年度用电量" className={`year-power ${lowYearPower || mediumYearPower || highYearPower ? 'show-proportion' : ''}`} extraText={
                        <div>{yearPower}<span className="unit">万千瓦时</span></div>
                    }/>
                    {
                        
                        <AtListItem title="" className="power-proporation" extraText={
                            lowYearPower || mediumYearPower || highYearPower
                            ? <View className="at-list__item"><Proportion data={items} /></View>
                            : null
                        }/>
                        
                    }
                    <AtListItem title="用电均价" extraText={<span>{averagePrice}<span className="unit">元/千瓦时</span></span>} />
                </AtList>
            </View>
        )
    }
}