import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'

const getTitle = (n) => {
    switch (n) {
        case 0:
            return '峰'
        case 1:
            return '平'
        case 2:
            return '谷'
    }
}
export default class Proportion extends Component {

    render() {
        let { data } = this.props;
        data = data.map((item, index) => ({
            range: item,
            title: getTitle(index)
        }))
        return (
            <View className='proportion at-row'>
                {
                    data && data.map((item, index) => <View className='at-col at-col-auto' style={{ flexGrow: item.range }} key={index}>{item.title}({item.range}%)</View>)
                }
            </View>
        )
    }
}