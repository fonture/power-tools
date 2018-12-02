import { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

export default class MonthButton extends Component {

  onClick = (month) => {
    const {data} = this.props
    const type = data.type
    switch(type) {
      case 'singleRegular':
      case 'singleProtocol':
        data[type].monthlyPowerVolume.current = month
        break
      default:
        data[type].monthlyPower.current = month
        break
    }
  }

  render() {
    const {data} = this.props
    const type = data.type
    let dataSet = [], current = 0
    switch(type) {
      case 'singleRegular':
      case 'singleProtocol':
        current = data[type].monthlyPowerVolume.current
        dataSet = data[type].monthlyPowerVolume.data
        break
      default:
        current = data[type].monthlyPower.current
        dataSet = data[type].monthlyPower.data
        break
    }

    return (
      <View className="month-plugin">
        <View className="at-row at-row--wrap">
          {
              dataSet.map((item, index) => (
                  <View key={index} className={`at-col at-col-2 month-item ${index > 5 ? 'secondLineMarginTop' : ''}`}>
                      <div className={`month-circle  ${item.finished ? 'finished': ''} ${index + 1 === current ? 'current' : ''}`} onClick={this.onClick.bind(this, index + 1)}>
                          {
                              item.finished
                              ? <div><img src={require('../../../assets/images/gou.png')} /></div>
                              : null
                          }
                          <div>{item.month}月</div>
                      </div>
                  </View>
              ))
          }
        </View>
      </View>
    )
  }
}
