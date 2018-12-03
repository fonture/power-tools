/*
 * @Author: ouyangdc 
 * @Date: 2018-12-02 16:21:02 
 * @Description: 输入面板
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-03 13:50:21
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtInput, AtCheckbox } from "taro-ui"
import { keepDecimal } from '../../../../utils'
import FiveMonth from '../../MonthPlugin/FiveMonth'
import './index.less'

export default class InputPanel extends Component {
    state = {
        checkedList: []
    }
    /**
     * @description 一般输入框的回调调用
     * @param {String} key 属性名
     * @param {String} value 属性值
     */
    onChangeValue = (key, value) => {
        value = keepDecimal(+value, 4)
        const { data, updateData } = this.props
        const type = data.type
        let dataSet = {}, current = 0
        const isMonthlyFill = data[type].isMonthlyFill
        if(!isMonthlyFill) {
            dataSet = data[type].yearlyData
        }else {
            let power = {}
            switch(type) {
                case 'singleRegular':
                case 'singleProtocol':
                    power = data[type].monthlyPowerVolume
                    break
                default:
                    power = data[type].monthlyPower
                    break
            }
            current = power.current
            dataSet = power.data[current].data
            power.data[current].finished = false
            dataSet[key].value = value
            for(let key in dataSet){
                if(dataSet[key].value){
                    power.data[current].finished = true
                }
            }
        }
        dataSet[key].value = value
        updateData()
    }
    /**
     * @description 6-10月富余电量的变更调用
     * @param {string} value 输入框的值
     */
    onChangeSurplusValue = (value) => {
        value = keepDecimal(+value, 4)
        const { data, updateData } = this.props
        const type = data.type
        const current = data[type].surplus.current - 5
        const dataSet = data[type].surplus.data
        dataSet[current].powerVolume = value
        dataSet[current].finished = value ? true : false
        updateData()
    }
    /**
     * @description 参与全水电交易品种的选中事件
     * @param {Array} value 由选中的项的value组成的数组，这时只有一项，所以数组长度最多是1
     */
    handleJoinChange = value => {
        const length = value.length
        const { data, updateData } = this.props
        const type = data.type
        data[type].isParticipate = length ? true : false
        updateData()
    }

    render() {
        const { data, updateData } = this.props
        const type = data.type
        let dataSet = {}, current = 0
        const isMonthlyFill = data[type].isMonthlyFill
        let surplus = {}, surplusCurr = 0, surplusData = []
        if(!isMonthlyFill) {
            dataSet = data[type].yearlyData
            if(type === 'regularAndSurplus' || type === 'protocolAndSurplus') {
                surplus = data[type].surplus
                surplusCurr = surplus.current
                surplusData = surplus.data
            }
        }else {
            switch(type) {
                case 'singleRegular':
                case 'singleProtocol':
                    current = data[type].monthlyPowerVolume.current
                    dataSet = data[type].monthlyPowerVolume.data[current].data
                    break
                default:
                    current = data[type].monthlyPower.current
                    dataSet = data[type].monthlyPower.data[current].data
                    break
            }
        }
        
        const dataSets = []
        for(let key in dataSet) {
            const data = dataSet[key]
            data.key = key
            if((type === 'regularAndSurplus' || type === 'protocolAndSurplus') && (current < 5 || current > 9) && (key == 'surplusPowerVolume' || key == 'surplusPowerPrice')) continue
            dataSets.push(data)
        }
        return (
            <AtList className="input-panel noPadding">
                {
                    dataSets.map((item, index) => 
                        <AtListItem title={item.name} key={index} extraText={
                            <View className="at-row at-row__justify--center at-row__align--center">
                                <AtInput type="number" className="power-input" border={false} value={item.value} onChange={this.onChangeValue.bind(this, item.key)}/>
                                <div className="unit">{item.unit}</div>
                            </View>
                        } />
                    )
                }
                {
                    !isMonthlyFill && (type === 'regularAndSurplus' || type === 'protocolAndSurplus')
                    ? (
                        <View className="surplus-panel">
                            <AtListItem className="five-month" extraText={
                                <FiveMonth data={data} updateData={updateData}/>
                            } />
                            <AtListItem title="富余电量" extraText={
                                <View className="at-row at-row__justify--center at-row__align--center">
                                    <AtInput type="number" className="power-input" border={false} value={surplusData[surplusCurr - 5].powerVolume} onChange={this.onChangeSurplusValue.bind(this)}/>
                                    <div className="unit">万千瓦时</div>
                                </View>
                            } />
                        </View>
                    )
                    : null
                }
                {
                    (type === 'singleProtocol' || type === 'protocolAndSurplus') && isMonthlyFill
                    ? <AtCheckbox
                        options={[{
                            value: 'joinAllPower',
                            label: '参与全水电交易品种',
                            desc: '',
                            disabled: false
                        }]}
                        selectedList={data[type].isParticipate ? ['joinAllPower'] : []}
                        onChange={this.handleJoinChange.bind(this)}
                    />
                    : null
                }
            </AtList>
        )
    }
}