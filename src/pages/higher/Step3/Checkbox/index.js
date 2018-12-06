/*
 * @Author: ouyangdc 
 * @Date: 2018-12-06 14:27:48 
 * @Description: 是否参与全水电复选框
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-06 14:53:20
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCheckbox } from "taro-ui"
import './index.less'

export default class Checkbox extends Component {
    /**
     * @description 参与全水电交易品种的选中事件
     * @param {Array} value 由选中的项的value组成的数组，这时只有一项，所以数组长度最多是1
     */
    handleJoinChange = (argName, value) => {
        const length = value.length
        const { data, updateData } = this.props
        const type = data.type
        data[type][argName] = length ? true : false
        updateData()
    }
    render() {
        const { data, key } = this.props
        const type = data.type
        return (
            <View className="join-all-water margin-top-20">
                <AtCheckbox
                    options={[{
                        value: key,
                        label: '参与全水电交易品种',
                        desc: '',
                        disabled: false
                    }]}
                    selectedList={data[type][key] ? [key] : []}
                    onChange={this.handleJoinChange.bind(this, key)}
                />
            </View>
            
        )
    }
}