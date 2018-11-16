import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import reduxHelper from '../../utils/reduxHelper'
import { connect } from '@tarojs/redux'
import './index.less'

const mapStateToProps = (store) => {
  const { count } = store
  if (count && JSON.stringify(count) !== '{}') {
    return {
      count: count.value
    }
  }
}

@connect(mapStateToProps)
export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }

  state = {
    editions: [
      {
        title: '简单版',
        edition: 'simple'
      },
      {
        title: '高级版',
        edition: 'higher'
      }
    ]
  }

  render() {
    return (
      <View className='index'>
        <h3 className="title">购电小工具</h3>
        {
          this.state.editions.map(item => <Button onClick={() => {
            Taro.redirectTo({ url: `pages/form/index?edition=${item.edition}` })
          }}>{item.title}</Button>)
        }
      </View>
    )
  }
}

