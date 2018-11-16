import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import reduxHelper from '../../utils/reduxHelper'
import { connect } from '@tarojs/redux'
import './index.less'

const mapStateToProps = (store) => {
  const { count } = store
  if ( count && JSON.stringify(count) !== '{}') {
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

  componentWillMount () { }

  componentDidMount () { 
    reduxHelper('count', {value: '22'})
  }

  componentWillUnmount () { }

  componentDidShow () { }

  componentDidHide () { }

  render () {
    return (
      <View className='index'>
        <Text>Hello world! {this.props.count}</Text>
      </View>
    )
  }
}

