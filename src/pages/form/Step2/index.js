import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { 
    AtList, 
    AtListItem, 
    AtActionSheet, 
    AtActionSheetItem, 
    AtCard, 
    AtInput,
} from 'taro-ui'
import PowerProportion from './PowerProportion'
import './index.less'

export default class Step2 extends Component {
    state = {
        isOpened: false,
        method: '用电量',
        high: 0,
        medium: 0,
        low: 0,
        highPrice: 0.8234,
        mediumPrice: 0.5234,
        lowPrice: 0.3324
    }
    componentDidMount() {
        // Taro.request({
        //     url: 'http://localhost:8080/test',
        //     method: 'GET',
        //     data: {
        //       foo: 'foo',
        //       bar: 10
        //     },
        //     header: {
        //       'content-type': 'application/json'
        //     }
        //   }).then(res => console.log(res.data))
    }
    /**
     * @description 点击输入方式时显示底部活动页
     */
    onToggleInputMethod = () => {
        this.setState({
            isOpened: true
        })
    }
    /**
     * @description 底部活动项的点击事件
     * @param {Object} e 事件对象
     */
    onClickSheet = (e) => {
        this.setState({
            method: e.target.innerHTML,
            isOpened: false
        })
    }
    /**
     * @description 峰平谷输入框值改变的时候调用
     * @param {String} type 峰平谷的标识，high为峰，medium为平， low为谷
     * @param {String} value 输入框的值
     */
    onChangeValue = (type, value) => {
        value = +value
        if(!isNaN(value)){
            this.setState({
                [type]: value
            })
        }
    }
    render() {
        const { high, medium, low, highPrice, mediumPrice, lowPrice, method} = this.state
        const sum = high + medium + low
        const price = high * highPrice + medium * mediumPrice + low * lowPrice
        const percent = sum ? (price / sum).toFixed(4) : 0
        const items = [
            {
                percent: sum && (high * 100 / sum).toFixed(2) + '%', 
                value: high, 
                itemName: '峰'
            }, {
                percent: sum && (medium * 100 / sum).toFixed(2) + '%', 
                value: medium, 
                itemName: '平'
            }, {
                percent: sum && (low * 100 / sum).toFixed(2) + '%', 
                value: low, 
                itemName: '谷'
            }
        ]
        return (
            <View className="power-cost">

                {/* 选择输入方式 */}
                <AtList className="input-method">
                    <AtListItem title="输入方式" arrow='right' extraText={this.state.method} onClick={this.onToggleInputMethod}/>
                </AtList>

                {/* 选择输入方式时底部弹出的活动页 */}
                <AtActionSheet isOpened={this.state.isOpened} title="请选择输入方式">
                    <AtActionSheetItem onClick={this.onClickSheet}>
                    用电量
                    </AtActionSheetItem>
                    <AtActionSheetItem onClick={this.onClickSheet}>
                    电度电价
                    </AtActionSheetItem>
                </AtActionSheet>

                {
                    method === '用电量'
                    ? <View>
                        {/* 峰平谷比例 */}
                        <AtCard
                            title="峰平谷比例"
                            isFull
                        >
                            <View className="at-row at-row__justify--center at-row__align--center">
                            {
                                items.map(item => {
                                    const { percent, value, itemName } = item
                                    return <PowerProportion percent={percent} value={value} itemName={itemName} onChangeValue={this.onChangeValue}/>
                                })
                            }    
                            </View>
                        </AtCard>

                        {/* 展示年度电量与用电均价 */}
                        <AtList className="power-result-list">
                            <AtListItem title="年度用电量" extraText={<span>{sum}<span className="power-result-unit">万千瓦时</span></span>} />
                            <AtListItem title="用电均价" extraText={<span>{percent}<span className="power-result-unit">元/千瓦时</span></span>} />
                        </AtList>
                    </View>
                    : <AtList className="power-input-self">
                        <AtListItem title="年度用电量" 
                            extraText={
                                <View className="at-row at-row__justify--center">
                                    <AtInput type="number" className="power-input" />
                                    <div className="power-result-unit">万千瓦时</div>
                                </View>
                            } 
                        />
                        <AtListItem title="用电均价" 
                            extraText={
                                <View className="at-row at-row__justify--center">
                                    <AtInput type="number" className="power-input" />
                                    <div className="power-result-unit">元/千瓦时</div>
                                </View>
                            } 
                        />
                    </AtList>
                }
            </View>
        )
    }
}