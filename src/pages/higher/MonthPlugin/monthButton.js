import { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

export default class MonthButton extends Component {

  render() {
    const { item, onClick } =  this.props;
    return (
      <View className="month-plugin">
      <View className={'at-col at-col-2 month-item'}>
        <div
          className={`month-circle ${item.finished ? 'finished' : ''} ${item.current ? 'current' : ''}`}
          onClick={onClick}>
          {
            item.finished
              ? <div><img src={require('../../../assets/images/gou.png')} /></div>
              : null
          }
          <div>{item.name}</div>
        </div>
      </View>
      </View>
    )
  }
}
