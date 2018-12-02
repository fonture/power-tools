/*
 * @Author: ouyangdc 
 * @Date: 2018-12-02 16:21:02 
 * @Description: 输入面板
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-02 17:21:43
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtList, AtListItem, AtInput } from "taro-ui"
import './index.less'

export default class InputPanel extends Component {
    onChangeValue = (key) => {

    }
    render() {
        const { data } = this.props
        const type = data.type
        let dataSet = {}, current = 0
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
        const dataSets = []
        for(let key in dataSet) {
            dataSets.push(dataSet[key])
        }
        return (
            <AtList className="input-panel noPadding">
                {
                    dataSets.map((item, index) => 
                        <AtListItem title={item.name} key={index} extraText={
                            <View className="at-row at-row__justify--center at-row__align--center">
                                <AtInput type="number" className="power-input" border={false} value={item.value} onChange={this.onChangeValue.bind(this, 'high')}/>
                                <div className="unit">{item.unit}</div>
                            </View>
                        } />
                    )
                }
                {/* <AtListItem title="峰时用电" extraText={
                    <View className="at-row at-row__justify--center at-row__align--center">
                        <AtInput type="number" className="power-input" border={false} value={data.high} maxlength={5} onChange={this.onChangeValue.bind(this, 'high')}/>
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
                } />                     */}
            </AtList>
        )
    }
}