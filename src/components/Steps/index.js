/*
 * @Author: ouyangdc 
 * @Date: 2018-11-19 11:03:54 
 * @Description: 表单顶部步骤条
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-11-19 16:24:47
 */
import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

export default class Steps extends Component {
    render() {
        const {current, items} = this.props
        return (
            <View className="flex-wrap">
            {
                items.map((item, index) => {
                    return [
                        <View className={index === current ? 'flex-item current' : 'flex-item'} >
                            <div className="checkbox-container" style={{borderColor: index < current ? '#636465' : '#D8E4E4'}}>
                                <div className={index <= current ? 'checked' : ''}>
                                    {
                                        index < current ? '✓' : ''
                                    }
                                </div>
                            </div>
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