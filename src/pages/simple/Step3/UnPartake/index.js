import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import {
    AtList,
    AtListItem,
    AtInput,
    AtCheckbox
} from 'taro-ui'
import {
    getAvPriceOfElePur,
    getAllWaterAvPriceOfElePur
} from '../../../../utils/formula';
import inject from '../../../../utils/inject'
import reduxHelper from '../../../../utils/reduxHelper'
@inject('unPartake', 'firePrice', 'newestTransmissionPrice', 'newestCataloguePrice')
export default class UnPartake extends Component {
    state = {
        checkedList: this.props.unPartake.checkedList || [],
        yearBuy: this.props.unPartake.yearBuy || 0,
        waterPrice: this.props.unPartake.waterPrice || 0,
        avPrice: this.props.unPartake.avPrice || ''
    }

    checkboxOption = [
        {
            value: 'joinWater',
            label: '参与全水电交易品种',
        }
    ]
    componentDidMount() {
        const { thermalPrice } = this.props.firePrice;
        if (thermalPrice) {
            this.getAvPrice();
        } else {
            Taro.redirectTo({
                url: 'pages/index'
            });
        }
    }
    handleCheckBoxChange = () => {
        this.setState({
            checkedList: this.state.checkedList.length === 0 ? ['joinWater'] : []
        }, this.getAvPrice)
    }
    handleInputChange = (...args) => {
        let [key, value, event] = args
        this.setState({
            [key]: Number(value)
        }, this.getAvPrice)
    }
    getAvPrice = () => {
        const { price } = this.props.newestTransmissionPrice;
        const { thermalPrice } = this.props.firePrice;
        const { collectionFund } = this.props.newestCataloguePrice;
        let avPrice;
        if (this.state.checkedList.length > 0) {
            avPrice = getAllWaterAvPriceOfElePur(this.state.waterPrice, price, collectionFund)
        } else {
            avPrice = getAvPriceOfElePur(this.state.waterPrice, thermalPrice, price, collectionFund)
        }
        this.setState({
            avPrice
        })
    }
    componentWillUnmount() {
        reduxHelper('unPartake', { ...this.state })
    }
    render() {
        return (
            <View>
                <View className="card">
                    <AtList>
                        <AtListItem
                            title='预计年度购电量'
                            extraText={
                                <AtInput
                                    type="number"
                                    className="power-input"
                                    title="万千瓦时"
                                    border={false}
                                    value={this.state.yearBuy}
                                    onChange={this.handleInputChange.bind(null, 'yearBuy')} />
                            }
                        />
                        <AtListItem
                            title='签约水电价格'
                            hasBorder={false}
                            extraText={
                                <AtInput
                                    type="number"
                                    className="power-input"
                                    title="万千瓦时"
                                    border={false}
                                    value={this.state.waterPrice}
                                    onChange={this.handleInputChange.bind(null, 'waterPrice')} />
                            }
                        />
                    </AtList>
                </View>
                <View className="card">
                    <AtList>
                        <AtCheckbox
                            options={this.checkboxOption}
                            selectedList={this.state.checkedList}
                            onChange={this.handleCheckBoxChange}
                        />
                        <AtListItem
                            title='购电均价'
                            hasBorder={false}
                            extraText={
                                <AtInput
                                    disabled
                                    type="number"
                                    className="power-input"
                                    title="元/千瓦时"
                                    border={false}
                                    value={this.state.avPrice} />
                            }
                        />
                    </AtList>
                </View>
            </View>)
    }
}