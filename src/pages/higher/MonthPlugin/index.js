/*
 * @Author: ouyangdc 
 * @Date: 2018-11-29 11:00:33 
 * @Description: 月份选择面板
 * @Last Modified by: ouyangdc
 * @Last Modified time: 2018-12-02 13:57:35
 */
import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { 
    AtCard
} from 'taro-ui'
import './index.less'

export default class Step2 extends Component {
    render() {
        return (
            <View className="month-plugin">
                {/* 月份操作区 */}
                <AtCard
                    isFull
                    title={this.props.title}
                >
                    <View className="at-row at-row--wrap">
                        {
                            this.props.data.map((item, index) => (
                                <View key={index} className={`at-col at-col-2 month-item ${index > 5 ? 'secondLineMarginTop' : ''}`}>
                                    <div className={`month-circle  ${item.finished ? 'finished': ''} ${index + 1 === this.props.current ? 'current' : ''}`} onClick={this.props.onClick.bind(this, index + 1)}>
                                        {
                                            item.finished
                                            ? <div><img src={require('../../../assets/images/gou.png')} /></div>
                                            : null
                                        }
                                        <div>{item.name}</div>
                                    </div>
                                </View>
                            ))
                        }
                    </View>
                </AtCard>
            </View>
        )
    }
}