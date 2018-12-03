/*
 * @Author: ouyangdc 
 * @Date: 2018-12-02 16:21:02 
 * @Description: 输入面板
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-02 18:12:40
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtInput } from "taro-ui"
import { keepDecimal } from '../../../../utils'
import './index.less'

export default class InputPanel extends Component {
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
    render() {
        const { data } = this.props
        const type = data.type
        let dataSet = {}, current = 0
        const isMonthlyFill = data[type].isMonthlyFill
        if(!isMonthlyFill) {
            dataSet = data[type].yearlyData
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
            </AtList>
        )
    }
}