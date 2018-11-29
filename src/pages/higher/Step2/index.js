/*
 * @Author: ouyangdc 
 * @Date: 2018-11-28 13:47:30 
 * @Description: 高级版第二步用电成本
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-29 10:02:45
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
import request from '../../../utils/request'
import inject from '../../../utils/inject'
import reduxHelper from '../../../utils/reduxHelper'
import { powerAveragePriceOfNotJoin } from '../../../utils/formula'
import { keepDecimal } from '../../../utils'
import Proportion from '../../../components/Proportion'
import './index.less'

@inject('yearCataloguePriceMap', 'powerCostsOfHigh')
export default class Step2 extends Component {
    state = {
        currMonth: this.props.powerCostsOfHigh.currMonth || 1,
        monthPowerList: this.props.powerCostsOfHigh.monthPowerList || [],
        yearPower: this.props.powerCostsOfHigh.monthPowerList || '',
        averagePrice: this.props.powerCostsOfHigh.averagePrice || '',
    }
    defaultProps = {
        powerCostsOfHigh: {},
        yearCataloguePriceMap: [
            {
                collectionFund: 0,
                cataloguePriceVoMap: {
                    peak: 0,
                    plain: 0,
                    valley: 0
                }
            }
        ]
    }
    componentWillMount(){
        if(this.state.monthPowerList.length === 0){
            for(let i = 0; i < 12; i++) {
                this.state.monthPowerList.push({
                    finished: false,
                    high: '',
                    medium: '',
                    low: ''
                })
            }
        }  
    }
    async componentDidMount(){
        reduxHelper('powerCostsOfHigh', this.state)

        // 请求基金、峰平谷电价
        const catalogueprice = await request({
            method: 'GET',
            url: '/wechat/kit/catalogueprice/year',
            data: {
                tradeCenter: 'sichuan', 
                category: 'a',
                voltage: 'a'
            }
        })
        catalogueprice && catalogueprice.data && reduxHelper('yearCataloguePriceMap', {...catalogueprice.data.yearCataloguePriceMap})
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
        const val = +value
        const { currMonth } = this.state
        const { yearCataloguePriceMap } = this.props
        // 取出当月峰平谷电价及基金
        const { collectionFund, cataloguePriceVoMap: { peak, plain, valley } } = yearCataloguePriceMap[currMonth]
        if(!isNaN(val)){
            const values = Object.assign({}, this.state.monthPowerList[currMonth - 1], {[type]: val})
            const { high, medium, low } = values
            const result = powerAveragePriceOfNotJoin(high, medium, low, peak.price, plain.price, valley.price, collectionFund)
            this.state.monthPowerList[currMonth - 1] = {
                ...values,
                ...result,
                finished: high && medium && low ? true : false
            }
            this.setState({})
        }
    }

    /**
     * @description 点击月份
     * @param {Number} currMonth 当前点击的月份
     */
    onClickMonth = (currMonth) => {
        this.setState({
            currMonth
        })
    }
    render() {
        const { currMonth, monthPowerList } = this.state
        const data = monthPowerList[currMonth - 1]
        const items = []
        data.yearPower && items.push(keepDecimal((data.high || 0) * 100 / data.yearPower, 2))
        data.yearPower && items.push(keepDecimal((data.medium || 0) * 100 / data.yearPower, 2))
        data.yearPower && items.push(keepDecimal((data.valley || 0) * 100 / data.yearPower, 2))
        return (
            <View className="elec-cost-high">
                {/* 月份操作区 */}
                <AtCard
                    isFull
                    title="用电成本"
                >
                    <View className="at-row at-row--wrap">
                        {
                            this.state.monthPowerList.map((item, index) => (
                                <View key={index} className={`at-col at-col-2 month-item ${index > 5 ? 'secondLineMarginTop' : ''}`}>
                                    <div className={`month-circle  ${item.finished ? 'finished': ''} ${index + 1 === this.state.currMonth ? 'current' : ''}`} onClick={this.onClickMonth.bind(this, index + 1)}>
                                        {
                                            item.finished
                                            ? <div><img src={require('../../../assets/images/gou.png')} /></div>
                                            : null
                                        }
                                        <div>{index + 1}月</div>
                                    </div>
                                </View>
                            ))
                        }
                    </View>
                </AtCard>

                {/* 峰平谷电量输入区 */}
                <AtCard
                    isFull
                    title={`${currMonth}月数据`}
                    className="noPadding"
                >
                    <AtList>
                        <AtListItem title="峰时用电" extraText={
                            <View className="at-row at-row__justify--center at-row__align--center">
                                <AtInput type="number" className="power-input" border={false} value={data.high} onChange={this.onChangeValue.bind(this, 'high')}/>
                                <div className="unit">万千瓦时</div>
                            </View>
                        } />
                        <AtListItem title="平时用电" extraText={
                            <View className="at-row at-row__justify--center at-row__align--center">
                                <AtInput type="number" className="power-input" border={false} value={data.medium} onChange={this.onChangeValue.bind(this, 'medium')}/>
                                <div className="unit">万千瓦时</div>
                            </View>
                        } />
                        <AtListItem title="谷时用电" extraText={
                            <View className="at-row at-row__justify--center at-row__align--center">
                                <AtInput type="number" className="power-input" border={false} value={data.low} onChange={this.onChangeValue.bind(this, 'low')}/>
                                <div className="unit">万千瓦时</div>
                            </View>
                        } />                    
                    </AtList>
                </AtCard>

                {/* 结果展示区 */}
                <AtList className="at-card">
                    <AtListItem title="年度用电量" className="year-power" extraText={
                        <div>{data.yearPower}<span className="unit">万千瓦时</span></div>
                    }/>
                    <View className="proporation at-list__item"><Proportion data={items} /></View>
                    <AtListItem title="用电均价" extraText={<span>{data.averagePrice}<span className="unit">元/千瓦时</span></span>} />
                </AtList>
            </View>
        )
    }
}