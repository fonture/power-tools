import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import {
    AtList,
    AtListItem,
    AtActionSheet,
    AtActionSheetItem,
    AtCard,
} from 'taro-ui'
import Input from '../../../../components/Input'
import PowerProportion from '../../../../components/PowerProportion'
import {
    powerAveragePriceOfNotJoin,
} from '../../../../utils/formula'
import inject from '../../../../utils/inject';
import reduxHelper from '../../../../utils/reduxHelper';
import '../index.less';

@inject('powerExpect', 'newestCataloguePrice', 'firePrice')
class Partake extends Component {
    state = {
        isOpened: false,
        method: this.props.powerExpect.method || '用电量',
        high: this.props.powerExpect.high || 0,
        medium: this.props.powerExpect.medium || 0,
        low: this.props.powerExpect.low || 0,
        highPrice: 0.8234,
        mediumPrice: 0.5234,
        lowPrice: 0.3324,
        averagePrice: this.props.powerExpect.averagePrice || 0,
        yearPower: this.props.powerExpect.yearPower || 0
    }
    componentDidMount() {
        const { thermalPrice } = this.props.firePrice;
        if (!thermalPrice) {
            Taro.redirectTo({
                url: 'pages/index'
            });
        }
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
        // if (this.state.method === e.target.innerHTML) return
        this.setState({
            method: e.target.innerHTML,
            isOpened: false,
            high: 0,
            medium: 0,
            low: 0,
            yearPower: 0,
            averagePrice: 0
        })
    }
    /**
     * @description 峰平谷输入框值改变的时候调用
     * @param {String} type 峰平谷的标识，high为峰，medium为平， low为谷
     * @param {String} value 输入框的值
     */
    onChangeValue = (type, value) => {
        value = +value
        if (!isNaN(value)) {
            const { isOpened, ...state } = this.state;
            const values = Object.assign({}, state, { [type]: value })
            const { high, medium, low } = values;
            const { cataloguePriceVoMap, collectionFund } = this.props.newestCataloguePrice;
            const { peak, plain, valley } = cataloguePriceVoMap
            let highPrice = peak.price,
                mediumPrice = plain.price,
                lowPrice = valley.price
            const result = powerAveragePriceOfNotJoin(high, medium, low, highPrice, mediumPrice, lowPrice, 0.5423)
            this.setState({
                ...values,
                ...result,
                isOpened: false
            })
        }
    }
    getCompData = () => {
        const { high, medium, low, highPrice, mediumPrice, lowPrice } = this.state;
        let res = powerAveragePriceOfNotJoin(high, medium, low, highPrice, mediumPrice, lowPrice, 1);
        const { yearPower, averagePrice } = res;
        this.setState({
            averagePrice
        })
    }
    handleValueChange = (...args) => {
        const [key, value,] = args;
        this.setState({
            [key]: value
        })
    }
    componentWillUnmount() {
        reduxHelper('powerExpect', { ...this.state })
    }
    handleClose = ()=> {
        this.setState({
            isOpened: false
        })
    }  
    render() {
        const { high, medium, low, highPrice, mediumPrice, lowPrice, method, yearPower, averagePrice } = this.state
        const items = [
            {
                percent: yearPower && (high * 100 / yearPower).toFixed(2) + '%',
                value: high,
                itemName: '峰'
            }, {
                percent: yearPower && (medium * 100 / yearPower).toFixed(2) + '%',
                value: medium,
                itemName: '平'
            }, {
                percent: yearPower && (low * 100 / yearPower).toFixed(2) + '%',
                value: low,
                itemName: '谷'
            }
        ]
        return (
            <View className="electricity-cost">

                {/* 选择输入方式 */}
                <View className="card">
                    <AtList className="input-method">
                        <AtListItem title="输入方式" arrow='right' hasBorder={false} extraText={this.state.method} onClick={this.onToggleInputMethod} />
                    </AtList>
                </View>

                {/* 选择输入方式时底部弹出的活动页 */}
                <AtActionSheet isOpened={this.state.isOpened} title="请选择输入方式" onClose={this.handleClose}>
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
                            <View className="card">
                                <AtCard
                                    title="峰平谷比例"
                                    isFull
                                >
                                    <View className="at-row at-row__justify--center at-row__align--center">
                                        {
                                            items.map(item => {
                                                const { percent, value, itemName } = item
                                                return <PowerProportion percent={percent} value={value} itemName={itemName} onChangeValue={this.onChangeValue} />
                                            })
                                        }
                                    </View>
                                </AtCard>
                            </View>
                            {/* 展示年度电量与用电均价 */}
                            <View className="card">
                                <AtList className="power-result-list">
                                    <AtListItem title="年度用电量" extraText={
                                        <Input
                                            disabled
                                            type="number"
                                            className="power-input"
                                            title="万千瓦时"
                                            digit={4}
                                            value={yearPower}
                                            border={false} />
                                    } />
                                    <AtListItem title="用电均价" hasBorder={false} extraText={
                                        <Input
                                            disabled
                                            type="number"
                                            className="power-input"
                                            title="元/千瓦时"
                                            digit={5}
                                            value={averagePrice}
                                            border={false} />
                                    } />
                                </AtList>
                            </View>
                        </View>
                        : <View className="card">
                            <AtList className="power-input-self">
                                <AtListItem title="年度用电量"
                                    extraText={
                                        <Input
                                            type="number"
                                            className="power-input"
                                            title="万千瓦时"
                                            border={false}
                                            value={yearPower}
                                            digit={4}
                                            onChange={this.handleValueChange.bind(null, 'yearPower')} />
                                    }
                                />
                                <AtListItem title="用电均价"
                                    hasBorder={false}
                                    extraText={
                                        <Input
                                            type="number"
                                            className="power-input"
                                            title="元/千瓦时"
                                            border={false}
                                            value={averagePrice}
                                            digit={5}
                                            onChange={this.handleValueChange.bind(null, 'averagePrice')} />
                                    }
                                />
                            </AtList>
                        </View>
                }
            </View>
        )
    }
}

export default Partake;