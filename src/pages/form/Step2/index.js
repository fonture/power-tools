import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Steps from '../../../components/steps'

export default class Step2 extends Component {
    render() {
        const items = [
            '第一步',
            '第二步',
            '第三步'
        ]
        return (
            <View>
                <Steps current={2} items={items}/>
            </View>
        )
    }
}