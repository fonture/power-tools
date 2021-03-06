/*
 * @Author: ouyangdc 
 * @Date: 2018-11-20 15:04:11 
 * @Description: 输入峰平谷单个组件
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-28 19:18:12
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { 
    AtInput,
} from 'taro-ui'
import './index.less'

export default class PowerProportion extends Component {
    render() {
        const { percent, value, onChangeValue, itemName, showPercent } = this.props
        return (
            <View className='power-proportion at-col'>
                <View className="at-row at-row__justify--center at-row__align--center">
                    <View className="at-col">
                        <AtInput 
                            type="number"
                            className="power-input" 
                            value={value} 
                            onChange={(value) => {
                                let type = 'high'
                                switch(itemName) {
                                    case '峰':
                                        type = 'high'
                                        break
                                    case '平':
                                        type = 'medium'
                                        break
                                    default:
                                        type = 'low'
                                }
                                onChangeValue(type, value)} 
                            }
                        />
                    </View>
                    <View className="at-col power-unit">万千瓦时</View>
                </View>
                <View className="at-row at-row__justify--center">{itemName}</View>
                <View className="at-row at-row__justify--center" showPercent>{percent ? percent : ''}</View>
            </View>
        )
    }
}