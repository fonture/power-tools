import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { withStore } from '../../store';
class Result extends Component {

    config = {
        navigationBarTitleText: '结果页'
    }

    handleLinkTo() {
        Taro.navigateTo({
            url: '/pages/index/index'
        })
    }
    render() {
        let data = this.props.store.getStore('data');
        return (
            <View className='index'>
                <Text onClick={this.handleLinkTo}>结果页</Text>
                <Text>hello,{data.name}</Text>
            </View>
        )
    }
}

export default withStore(Result)
