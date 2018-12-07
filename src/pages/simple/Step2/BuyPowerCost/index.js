/*
 * @Author: ouyangdc 
 * @Date: 2018-11-23 16:13:09 
 * @Description: 简单版 -- 第二步 -- 购电成本
 * @Last Modified by: mikey.zhaopeng
 * @Last Modified time: 2018-12-07 13:52:15
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
import { reLocateButton } from '../../../../utils'
import Input from '../../../../components/Input'
import './index.less'

@inject('newestCataloguePrice', 'newestTransmissionPrice', 'firePrice', 'buyPowerCostData')
export default class BuyPowerCost extends Component {
    // 初始化的state要从redux中获取，以便点了“上一步”或者“下一步”再回来时数据还在
    state = {
        isOpened: false,
        method: this.props.buyPowerCostData.method ,
        checkedList: this.props.buyPowerCostData.checkedList ,
        yearPower: this.props.buyPowerCostData.yearPower, 
        deviationCost: this.props.buyPowerCostData.deviationCost, 
        signedPrice: this.props.buyPowerCostData.signedPrice, 
        averagePrice: this.props.buyPowerCostData.averagePrice,
        inputYearPower: this.props.buyPowerCostData.inputYearPower,
        inputAveragePrice: this.props.buyPowerCostData.inputAveragePrice,
    }
    componentWillMount(){
        const { yearPower, deviationCost, signedPrice, method, inputYearPower, inputAveragePrice, checkedList } = this.state
        if(this.props.newestCataloguePrice && this.props.newestTransmissionPrice) {
            const { newestCataloguePrice: { collectionFund }, newestTransmissionPrice: { price }, firePrice } = this.props
            const averagePrice = powerAveragePriceOfJoin(firePrice, price, collectionFund, yearPower, deviationCost, signedPrice, checkedList.length)
            this.setState({
                averagePrice
            })
        }
        
        /**
         * 判断初始化时组件中的数据是否为有效数据。如果有效，则“下一步”按钮默认可点击，否则不可点击
         * 如果当前的输入方式是年度用电量，则需要判断年度用电量、年度偏差考核费用、签约水电价格的值是否有效
         * 如果当前的输入方式是购电均价，则需要判断年度用电量、购电均价的值是否有效
         **/
        if(method === '购电均价'){
            if(inputYearPower && inputAveragePrice) {
                reduxHelper('next', true)
            } else {
                reduxHelper('next', false)
            }
        } else {
            if(yearPower && deviationCost && signedPrice) {
                reduxHelper('next', true)
            } else {
                reduxHelper('next', false)
            }
        }
    }
    componentDidUpdate(){
        reLocateButton()
    }

    /**
     * @description 组件卸载时，需要将报告中需要的数据存在powerCosts中
     */
    componentWillUnmount() {
        const { yearPower, averagePrice, method, inputAveragePrice, inputYearPower } = this.state
        let tempYearPower = 0, tempAveragePrice = 0
        
        // 根据不同的输入方式，将不同的年度用电量和均价存入powerCosts以便在生成报告时使用
        if(method === '购电均价') {
            tempYearPower = inputYearPower
            tempAveragePrice = inputAveragePrice
        }else {
            tempYearPower = yearPower
            tempAveragePrice = averagePrice
        }
        reduxHelper('powerCosts', { yearPower: tempYearPower, averagePrice: tempAveragePrice })
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
            reduxHelper('buyPowerCostData', this.state)
            const { yearPower, deviationCost, signedPrice, method, inputYearPower, inputAveragePrice } = this.state
            if(method === '购电均价'){
                if(inputYearPower && inputAveragePrice) {
                    reduxHelper('next', true)
                } else {
                    reduxHelper('next', false)
                }
            } else {
                if(yearPower && deviationCost && signedPrice) {
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
        
        const { newestCataloguePrice: { collectionFund }, newestTransmissionPrice: { price }, firePrice } = this.props
        let values = { ...this.state }

        // 如果type不为undefined，即不是点击是否参与全水电选项触发的
        if(type) {
            values = Object.assign({}, values, {[type]: value})
        }
        // 年度用电量需要计算。如果购电均价是手动输入的，不需要重新计算
        if(values.method === '年度用电量') {
            // 计算均价
            let { yearPower, deviationCost, signedPrice, checkedList } = values
            values.averagePrice = powerAveragePriceOfJoin(firePrice, price, collectionFund, yearPower, deviationCost, signedPrice, checkedList.length)
        }

        // 更新state
        this.setState({
            ...values,
            isOpened: false
        })

        // 将最新数据存入redux中
        reduxHelper('buyPowerCostData', values)
        
        // 检测是否可以点击“下一步”
        const { yearPower, deviationCost, signedPrice, inputAveragePrice, inputYearPower, method } = values
        if(method === '购电均价'){
            if(inputYearPower && inputAveragePrice) {
                reduxHelper('next', true)
            } else {
                reduxHelper('next', false)
            }
        } else {
            if(yearPower && deviationCost && signedPrice) {
                reduxHelper('next', true)
            } else {
                reduxHelper('next', false)
            }
        }
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

    /**
     * @description 底部活动页的关闭事件
     */
    handleClose = ()=> {
        this.setState({
            isOpened: false
        })
    }    
    render() {
        const { method, yearPower, deviationCost, signedPrice, averagePrice, inputYearPower, inputAveragePrice } = this.state
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
                                        <Input type="number" digit={0} className="power-input" border={false} value={deviationCost} onChange={this.onChangeValue.bind(this, 'deviationCost')}/>
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
                                    <Input type="number" digit={4} className="power-input" border={false} value={inputYearPower}  onChange={this.onChangeValue.bind(this, 'inputYearPower')}/>
                                    <div className="power-result-unit">万千瓦时</div>
                                </View>
                            } 
                        />
                        <AtListItem title="购电均价" onClick={this.onListClick}
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
