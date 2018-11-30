/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:13:09 
 * @Description: 参与市场时的购电成本
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-30 17:03:49
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { 
    AtList, 
    AtListItem, 
    AtActionSheet, 
    AtActionSheetItem, 
    AtCheckbox,
} from 'taro-ui'
import { powerAveragePriceOfJoin } from '../../../../utils/formula'
import reduxHelper from '../../../../utils/reduxHelper'
import inject from '../../../../utils/inject'
import Input from '../../../../components/Input'
import './index.less'

@inject('newestCataloguePrice', 'newestTransmissionPrice', 'firePrice', 'buyPowerCostData')
export default class BuyPowerCost extends Component {
    state = {
        isOpened: false,
        method: this.props.buyPowerCostData.method || '年度用电量',
        checkedList: this.props.buyPowerCostData.checkedList || [],
        yearPower: this.props.buyPowerCostData.yearPower || '', 
        deviationCost: this.props.buyPowerCostData.deviationCost || '', 
        signedPrice: this.props.buyPowerCostData.signedPrice || '', 
        averagePrice: this.props.buyPowerCostData.averagePrice || '',
    }
    defaultProps = { 
        newestCataloguePrice: { collectionFund: 0 }, 
        newestTransmissionPrice: { price: 0 },
        firePrice: {thermalPrice: 0},
        buyPowerCostData: {}
    }
    componentDidMount(){
        reduxHelper('buyPowerCostData', this.state)
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
            reduxHelper('buyPowerCostData', this.state)
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
            checkedList: [],
            yearPower: '', 
            deviationCost: '', 
            signedPrice: '', 
            averagePrice: ''
        }, () => {
            reduxHelper('buyPowerCostData', this.state)
        })
    }
    /**
     * @description 峰平谷输入框值改变的时候调用
     * @param {String} type 峰平谷的标识，high为峰，medium为平， low为谷
     * @param {String} value 输入框的值
     */
    onChangeValue = (type, value) => {
        const { yearPower, deviationCost, signedPrice, method, checkedList } = this.state
        const { newestCataloguePrice: { collectionFund }, newestTransmissionPrice: { price }, firePrice: { thermalPrice } } = this.props
        let values = { yearPower, deviationCost, signedPrice }

        // 如果type不为undefined，即不是点击是否参与全水电选项触发的
        if(type) {
            value = +value
            values = Object.assign({}, values, {[type]: value})
        }
        // 年度用电量需要计算。如果购电均价是手动输入的，不需要重新计算
        if(method === '年度用电量') {
            // 计算均价
            let { yearPower, deviationCost, signedPrice } = values
            yearPower = yearPower === '' ? 0 : yearPower
            deviationCost = deviationCost === '' ? 0 : deviationCost
            signedPrice = signedPrice === '' ? 0 : signedPrice
            values.averagePrice = powerAveragePriceOfJoin(thermalPrice, price, collectionFund, yearPower, deviationCost, signedPrice, checkedList.length)
        }
        
        this.setState({
            ...values,
            isOpened: false
        }, () => {
            reduxHelper('buyPowerCostData', this.state)
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
        e.preventDefault()
        e.currentTarget.getElementsByTagName('input')[0].focus()
    }
    handleClose = ()=> {
        this.setState({
            isOpened: false
        })
    }    
    render() {
        const { method, yearPower, deviationCost, signedPrice, averagePrice} = this.state

        return (
            <View className="power-cost">

                {/* 选择输入方式 */}
                <AtList className="card-group input-method">
                    <AtListItem title="输入方式" arrow='right' extraText={this.state.method} onClick={this.onToggleInputMethod}/>
                </AtList>

                {/* 选择输入方式时底部弹出的活动页 */}
                <AtActionSheet isOpened={this.state.isOpened} title="请选择输入方式" onClose={this.handleClose}>
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
                        <AtList className="card-group power-input-list">
                            <AtListItem title="年度用电量" onClick={this.onListClick}
                                extraText={
                                    <View className="at-row at-row__justify--center at-row__align--center">
                                        <Input type="number" digit={4}  className="power-input" border={false} value={yearPower} onChange={this.onChangeValue.bind(this, 'yearPower')}/>
                                        <div className="power-result-unit">万千瓦时</div>
                                    </View>
                                } 
                            />
                            <AtListItem title="年度偏差考核费用" onClick={this.onListClick}
                                extraText={
                                    <View className="at-row at-row__justify--center at-row__align--center">
                                        <Input type="number" digit={5} className="power-input" border={false} value={deviationCost} onChange={this.onChangeValue.bind(this, 'deviationCost')}/>
                                        <div className="power-result-unit">元</div>
                                    </View>
                                } 
                            />
                            <AtListItem title="签约水电价格" onClick={this.onListClick}
                                extraText={
                                    <View className="at-row at-row__justify--center at-row__align--center">
                                        <Input type="number" digit={5} className="power-input" border={false} value={signedPrice} onChange={this.onChangeValue.bind(this, 'signedPrice')}/>
                                        <div className="power-result-unit">元/千瓦时</div>
                                    </View>
                                } 
                            />
                        </AtList>
                        <AtList className="card-group power-result-list">
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
                            <AtListItem title="购电均价" extraText={<span>{averagePrice}<span className="power-result-unit">元/千瓦时</span></span>} />
                        </AtList>
                    </View>
                    // 购电均价
                    : <AtList className="card-group power-input-self">
                        <AtListItem title="年度用电量" onClick={this.onListClick}
                            extraText={
                                <View className="at-row at-row__justify--center at-row__align--center">
                                    <Input type="number" digit={4} className="power-input" border={false} value={yearPower}  onChange={this.onChangeValue.bind(this, 'yearPower')}/>
                                    <div className="power-result-unit">万千瓦时</div>
                                </View>
                            } 
                        />
                        <AtListItem title="购电均价" onClick={this.onListClick}
                            extraText={
                                <View className="at-row at-row__justify--center at-row__align--center">
                                    <Input type="number" digit={5} className="power-input" border={false} value={averagePrice} onChange={this.onChangeValue.bind(this, 'averagePrice')}/>
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
