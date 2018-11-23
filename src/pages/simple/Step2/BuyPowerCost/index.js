/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:13:09 
 * @Description: 参与市场时的购电成本
 * @Last Modified by:   ouyangdc 
 * @Last Modified time: 2018-11-23 16:13:09 
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { 
    AtList, 
    AtListItem, 
    AtActionSheet, 
    AtActionSheetItem, 
    AtInput,
    AtCheckbox,
} from 'taro-ui'
import { powerAveragePriceOfJoin } from '../../../../utils/formula'
import reduxHelper from '../../../../utils/reduxHelper'
import './index.less'

export default class BuyPowerCost extends Component {
    state = {
        isOpened: false,
        method: '年度用电量',
        checkedList: [],
        yearPower: 0, 
        deviationCost: 0, 
        signedPrice: 0, 
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
        this.setState({
            method: e.target.innerHTML,
            isOpened: false,
            checkedList: [],
            yearPower: 0, 
            deviationCost: 0, 
            signedPrice: 0, 
            averagePrice: 0
        })
    }
    /**
     * @description 峰平谷输入框值改变的时候调用
     * @param {String} type 峰平谷的标识，high为峰，medium为平， low为谷
     * @param {String} value 输入框的值
     */
    onChangeValue = (type, value) => {
        const { yearPower, deviationCost, signedPrice, method, checkedList } = this.state
        let values = { yearPower, deviationCost, signedPrice }

        // 如果type不为undefined，即不是点击是否参与全水电选项触发的
        if(type) {
            value = +value
            values = Object.assign({}, values, {[type]: value})
        }
        // 如果购电均价是手动输入的，也不需要重新计算了
        if(method === '年度用电量') {
            /****
             * ToDo: 根据公式计算购电均价
             */
            const { yearPower, deviationCost, signedPrice } = values
            values.averagePrice = powerAveragePriceOfJoin(0.5360, 0.3456, 0.6393, yearPower, deviationCost, signedPrice, checkedList.length)
        }
        
        this.setState({
            ...values
        })
    }

    /**
     * @description 参与全水电交易品种的选中事件
     * @param {Array} value 由选中的项的value组成的数组，这时只有一项，所以数组长度最多是1
     */
    handleJoinChange = value => {
        this.setState({
            checkedList: value
        }, this.onChangeValue)
    }
    /**
     * @description 点击每一个列表项时将光标聚集到该行的输入框中
     * @param {Object} e 事件对象
     */
    onListClick = (e) => {
        e.currentTarget.getElementsByTagName('input')[0].focus()
    }
    render() {
        const { method, yearPower, deviationCost, signedPrice, averagePrice} = this.state

        return (
            <View className="buy-power-cost">

                {/* 选择输入方式 */}
                <AtList className="input-method">
                    <AtListItem title="输入方式" arrow='right' extraText={this.state.method} onClick={this.onToggleInputMethod}/>
                </AtList>

                {/* 选择输入方式时底部弹出的活动页 */}
                <AtActionSheet isOpened={this.state.isOpened} title="请选择输入方式">
                    <AtActionSheetItem onClick={this.onClickSheet}>
                    年度用电量
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={this.onClickSheet}>
                    购电均价
                    </AtActionSheetItem>
                </AtActionSheet>

                {
                    method === '年度用电量'
                    // 年度用电量
                    ? <View>
                        <AtList className="power-input-list">
                            <AtListItem title="年度用电量" onClick={this.onListClick}
                                extraText={
                                    <View className="at-row at-row__justify--center at-row__align--center">
                                        <AtInput type="number" className="power-input" border={false} value={yearPower ? yearPower : ''} onChange={this.onChangeValue.bind(this, 'yearPower')}/>
                                        <div className="power-result-unit">万千瓦时</div>
                                    </View>
                                } 
                            />
                            <AtListItem title="年度偏差考核费用" onClick={this.onListClick}
                                extraText={
                                    <View className="at-row at-row__justify--center at-row__align--center">
                                        <AtInput type="number" className="power-input" border={false} value={deviationCost ? deviationCost : ''} onChange={this.onChangeValue.bind(this, 'deviationCost')}/>
                                        <div className="power-result-unit">元</div>
                                    </View>
                                } 
                            />
                            <AtListItem title="签约水电价格" onClick={this.onListClick}
                                extraText={
                                    <View className="at-row at-row__justify--center at-row__align--center">
                                        <AtInput type="number" className="power-input" border={false} value={signedPrice ? signedPrice : ''} onChange={this.onChangeValue.bind(this, 'signedPrice')}/>
                                        <div className="power-result-unit">元/千瓦时</div>
                                    </View>
                                } 
                            />
                        </AtList>
                        <AtList className="power-result-list">
                            <AtCheckbox
                                options={[{
                                    value: 'joinAllPower',
                                    label: '参与全水电交易品种',
                                    desc: '',
                                    disabled: false
                                }]}
                                selectedList={this.state.checkedList}
                                onChange={this.handleJoinChange.bind(this)}
                            />
                            <AtListItem title="购电均价" extraText={<span>{averagePrice ? averagePrice : ''}<span className="power-result-unit">元/千瓦时</span></span>} />
                        </AtList>
                    </View>
                    // 购电均价
                    : <AtList className="power-input-self">
                        <AtListItem title="年度用电量" onClick={this.onListClick}
                            extraText={
                                <View className="at-row at-row__justify--center at-row__align--center">
                                    <AtInput type="number" className="power-input" border={false} value={yearPower ? yearPower : ''}  onChange={this.onChangeValue.bind(this, 'yearPower')}/>
                                    <div className="power-result-unit">万千瓦时</div>
                                </View>
                            } 
                        />
                        <AtListItem title="购电均价" onClick={this.onListClick}
                            extraText={
                                <View className="at-row at-row__justify--center at-row__align--center">
                                    <AtInput type="number" className="power-input" border={false} value={averagePrice ? averagePrice : ''} onChange={this.onChangeValue.bind(this, 'averagePrice')}/>
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