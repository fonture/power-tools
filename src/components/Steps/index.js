/*
 * @Author: ouyangdc 
 * @Date: 2018-11-19 11:03:54 
 * @Description: 表单顶部步骤条
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-22 11:18:11
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
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" className={index < current ? 'active' : (index === current ? 'current' : '')} >
                                <circle className="outerCircle" cx="10" cy="10" r="8" />
                                {
                                    index === current
                                    ? <circle className="innerCircle" cx="10" cy="10" r="4" />
                                    : (
                                        index < current
                                        ? <polygon class="hook" points="29.2,13 16.3,23.2 11.1,19.6 10,20.8 14.1,24.7 16.4,27 18.8,24.6 30,13.8 "/>
                                        : null
                                    )
                                }
                            </svg>
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