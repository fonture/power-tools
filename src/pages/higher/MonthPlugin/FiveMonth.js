/*
 * @Author: ouyangdc 
 * @Date: 2018-12-02 15:46:21 
 * @Description: 只有5个月的月份面板
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-02 16:19:47
 */
import { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import './index.less'

export default class MonthButton extends Component {

  onClick = (month) => {
    const {data} = this.props
    const type = data.type
    data[type].surplus.current = month
    this.props.updateData()
  }

  render() {
    const {data} = this.props
    const type = data.type
    let dataSet = [], current = 0
    current = data[type].surplus.current
    dataSet = data[type].surplus.data

    return (
      <View className="month-plugin">
        <View className="at-row at-row--wrap">
          {
            dataSet.map((item, index) => (
                <View key={index} className={`at-col at-col-2 month-item`}>
                    <div className={`month-circle  ${item.finished ? 'finished': ''} ${index === current ? 'current' : ''}`} onClick={this.onClick.bind(this, index)}>
                        {
                            item.finished
                            ? <div><img src={require('../../../assets/images/gou.png')} /></div>
                            : null
                        }
                        <div>{item.month + 1}月</div>
                    </div>
                </View>
            ))
          }
        </View>
      </View>
    )
  }
}