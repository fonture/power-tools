import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button } from '@tarojs/components'
import './index.less'
import { withStore, initStore } from '../../store';

initStore();
class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  handleLinkTo = () => {
    Taro.navigateTo({
      url: '/pages/form/index'
    })
  }
  render() {
    return (
      <View className='index'>
        <Text>购电小工具</Text>
        <Button onClick={this.handleLinkTo}>下一步</Button>
      </View>
    )
  }
}

export default withStore(Index)
