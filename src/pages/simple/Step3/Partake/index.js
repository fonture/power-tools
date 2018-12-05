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
import { validate } from '../../../../utils'

@inject('powerExpect', 'newestCataloguePrice', 'firePrice', 'next')
class Partake extends Component {
    state = {
        isOpened: false,
        method: this.props.powerExpect.method || '用电量',
        high: this.props.powerExpect.high || undefined,
        medium: this.props.powerExpect.medium || undefined,
        low: this.props.powerExpect.low || undefined,
        averagePrice: this.props.powerExpect.averagePrice || undefined,
        yearPower: this.props.powerExpect.yearPower || undefined,
        rememberData: {
            averagePrice: undefined,
            yearPower: undefined
        }
    }
    componentDidMount() {
        const { firePrice } = this.props;
        if (!firePrice) {
            Taro.redirectTo({
                url: 'pages/index'
            });
        }else{
            this.getCompData();           
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
        if (e.target.innerHTML !== '电度电价') {
            this.setState({
                method: e.target.innerHTML,
                isOpened: false,
                rememberData: {
                    averagePrice: this.state.averagePrice,
                    yearPower: this.state.yearPower
                }
            })
            this.getCompData();
        }else{
            this.setState({
                method: e.target.innerHTML,
                isOpened: false,
                averagePrice: this.state.rememberData.averagePrice,
                yearPower: this.state.rememberData.yearPower
            })            
        }
    }
    /**
     * @description 峰平谷输入框值改变的时候调用
     * @param {String} type 峰平谷的标识，high为峰，medium为平， low为谷
     * @param {String} value 输入框的值
     */
    onChangeValue = (type, value) => {
        if (!isNaN(value)) {
            const { isOpened, ...state } = this.state;
            const values = Object.assign({}, state, { [type]: value })
            const { high, medium, low } = values;
            const { cataloguePriceVoMap, collectionFund } = this.props.newestCataloguePrice;
            const { peak, plain, valley } = cataloguePriceVoMap
            let highPrice = peak.price,
                mediumPrice = plain.price,
                lowPrice = valley.price
            const result = powerAveragePriceOfNotJoin(high, medium, low, highPrice, mediumPrice, lowPrice, collectionFund)
            this.setState({
                ...values,
                ...result,
                isOpened: false
            })
        }
    }
    getCompData = () => {
        const { high, medium, low } = this.state;
        const { cataloguePriceVoMap, collectionFund } = this.props.newestCataloguePrice;
        const { peak, plain, valley } = cataloguePriceVoMap
        let highPrice = peak.price,
            mediumPrice = plain.price,
            lowPrice = valley.price
        let res = powerAveragePriceOfNotJoin(high, medium, low, highPrice, mediumPrice, lowPrice, collectionFund);
        const { yearPower, averagePrice } = res;
        this.setState({
            averagePrice,
            yearPower
        })
    }
    handleValueChange = (...args) => {
        const [key, value,] = args;
        this.setState({
            [key]: value
        })
    }
    componentWillMount() {
        this.validate();
    }
    componentWillUnmount() {
        reduxHelper('powerExpect', { ...this.state })
    }
    handleClose = () => {
        this.setState({
            isOpened: false
        })
    }
    componentDidUpdate() {
        this.validate();
    }
    validate = () => {
        const { averagePrice, yearPower, high, medium, low, method } = this.state;
        if (method === '用电量') {
            reduxHelper('next', validate(high, medium, low))
        } else {
            reduxHelper('next', validate(averagePrice, yearPower))
        }
    }
    render() {
        const { high, medium, low, method, yearPower, averagePrice } = this.state
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
                                    className="card-group"
                                    title="峰平谷比例"
                                    isFull
                                >
                                    {/* <View className="at-row at-row__justify--center at-row__align--center">
                            {
                                items.map(item => {
                                    const { percent, value, itemName } = item
                                    return <PowerProportion percent={percent} value={value} itemName={itemName} showPercent={true} onChangeValue={this.onChangeValue.bind(this)}/>
                                })
                            }    
                            </View> */}
                                    <AtList className="">
                                        <AtListItem title="峰时用电" onClick={this.onListClick}
                                            extraText={
                                                <View className="at-row at-row__justify--center at-row__align--center">
                                                    <Input type="number" digit={4} className="power-input" border={false} value={high} onChange={this.onChangeValue.bind(this, 'high')} />
                                                    <div className="power-result-unit">万千瓦时</div>
                                                </View>
                                            }
                                        />
                                        <AtListItem title="平时用电" onClick={this.onListClick}
                                            extraText={
                                                <View className="at-row at-row__justify--center at-row__align--center">
                                                    <Input type="number" digit={5} className="power-input" border={false} value={medium} onChange={this.onChangeValue.bind(this, 'medium')} />
                                                    <div className="power-result-unit">万千瓦时</div>
                                                </View>
                                            }
                                        />
                                        <AtListItem title="谷时用电" onClick={this.onListClick}
                                            extraText={
                                                <View className="at-row at-row__justify--center at-row__align--center">
                                                    <Input type="number" digit={5} className="power-input" border={false} value={low} onChange={this.onChangeValue.bind(this, 'low')} />
                                                    <div className="power-result-unit">万千瓦时</div>
                                                </View>
                                            }
                                        />
                                    </AtList>
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