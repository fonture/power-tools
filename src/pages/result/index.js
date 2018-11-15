import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import './index.less'
import { withStore } from '../../store';
class Result extends Component {

    config = {
        navigationBarTitleText: '结果页'
    }

    handleLinkTo() {
        Taro.redirectTo({
            url: '/pages/index/index'
        })
    }
    render() {
        console.log(this.props.store);
        return (
            <View className='index'>
                <Text onClick={this.handleLinkTo}>结果页</Text>
                <Text>hello,{this.props.store.data.name}</Text>
            </View>
        )
    }
}

export default withStore(Result)
