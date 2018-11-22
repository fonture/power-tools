import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
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
    activeNode: null,
  }
  editions= [
    {
      title: '简单版',
      edition: 'simple',
      img: require('../../assets/simple.png'),
    },
    {
      title: '高级版',
      edition: 'higher',
      img: require('../../assets/higher.png'),
    }
  ]
  changeVersion = (edition) => {
    this.setState({
      activeNode: edition,
    }, () => {
      setTimeout(() => {
        reduxHelper('version', { value: edition })
        Taro.redirectTo({ url: `pages/${edition}/index` })
      }, 1000);
    })
  }

  render() {
    const { activeNode } = this.state;
    return (
      <View className={`index page ${activeNode === null ? '': 'active'}`}>
        {
          this.editions.map(item =>
          <View
            key={item.edition}
            onClick={this.changeVersion.bind(this,item.edition)}
            className={`BoxAvatar ${item.edition === activeNode ? 'acHide' : ''}`}
          >
            <Image
              src={item.img}
              mode='aspectFill'
              className='indexAtAvatar'
            />
          </View>
          )
        }
      </View>
    )
  }
}

