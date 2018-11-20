/*
 * @Author: ouyangdc 
 * @Date: 2018-11-19 11:03:54 
 * @Description: 表单顶部步骤条
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-20 10:00:09
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import './index.less'

export default class Steps extends Component {
    render() {
        const {current, items} = this.props
        return (
            <View className="flex-wrap">
            {
                items.map((item, index) => {
                    return [
                        <View className="flex-item">
                            <Input 
                                type="checkbox" 
                                className={index === current ? 'current' : ''} 
                                checked={index <= current ? true : false}
                                style={{borderColor: index < current ? '#636465' : '#D8E4E4'}} 
                                disabled
                            />
                            <Text style={{color: index < current ? '#636465' : '#D8E4E4', fontSize: '10px'}}>{item}</Text>
                        </View>,
                        index === items.length - 1 ? null : <hr style={{borderColor: index < current ? '#636465' : '#EDFAFA'}}/>
                    ]
                })
            }
            </View>
        )
    }
}

Steps.defaultProps = {
    current: 0,
    items: []
}