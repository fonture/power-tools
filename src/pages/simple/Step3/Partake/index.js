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
import PowerProportion from '../../Step2/ElectricityCost/PowerProportion'
import {
    powerAveragePriceOfNotJoin,
} from '../../../../utils/formula'


export default class Partake extends Component {
    state = {
        isOpened: false,
        method: '用电量',
        high: 0,
        medium: 0,
        low: 0,
        highPrice: 0.8234,
        mediumPrice: 0.5234,
        lowPrice: 0.3324,
        basePrice: 0.0324,
        averagePrice: 0,
        yearPower: 0
    }
    componentDidMount() {

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
    getCompData = () => {
        const {high, medium, low,highPrice, mediumPrice, lowPrice} = this.state;
        let res = powerAveragePriceOfNotJoin(high, medium, low, highPrice, mediumPrice, lowPrice, 1);
        const {yearPower, averagePrice} = res;
        this.setState({
            averagePrice
        })
    }
    render() {
        const { high, medium, low, highPrice, mediumPrice, lowPrice, method, basePrice, yearPower, averagePrice } = this.state
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
                <View className="card">
                    <AtList className="input-method">
                        <AtListItem title="输入方式" arrow='right' hasBorder={false} extraText={this.state.method} onClick={this.onToggleInputMethod} />
                    </AtList>
                </View>

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
                            <View className="card">
                                <AtCard
                                    title="峰平谷比例"
                                    isFull
                                >
                                    <View className="at-row at-row__justify--center at-row__align--center">
                                        {
                                            items.map(item => {
                                                const { percent, value, itemName } = item
                                                return <PowerProportion percent={percent} value={value} itemName={itemName} onChangeValue={this.onChangeValue} />
                                            })
                                        }
                                    </View>
                                </AtCard>
                            </View>
                            {/* 展示年度电量与用电均价 */}
                            <View className="card">
                                <AtList className="power-result-list">
                                    <AtListItem title="年度用电量" extraText={
                                        <AtInput
                                            disabled
                                            type="number"
                                            className="power-input"
                                            title="万千瓦时"
                                            value={yearPower}
                                            border={false} />
                                    } />
                                    <AtListItem title="用电均价" hasBorder={false} extraText={
                                        <AtInput
                                            disabled
                                            type="number"
                                            className="power-input"
                                            title="元/千瓦时"
                                            value={averagePrice}
                                            border={false} />
                                    } />
                                </AtList>
                            </View>
                        </View>
                        : <View className="card">
                            <AtList className="power-input-self">
                                <AtListItem title="年度用电量"
                                    extraText={
                                        <AtInput
                                            type="number"
                                            className="power-input"
                                            title="万千瓦时"
                                            border={false} 
                                            value={yearPower}/>
                                    }
                                />
                                <AtListItem title="用电均价"
                                    hasBorder={false}
                                    extraText={
                                        <AtInput
                                            type="number"
                                            className="power-input"
                                            title="元/千瓦时"
                                            border={false}
                                            value={averagePrice} />
                                    }
                                />
                            </AtList>
                        </View>
                }
            </View>
        )
    }
}