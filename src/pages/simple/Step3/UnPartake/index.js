import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import {
    AtList,
    AtListItem,
    AtCheckbox
} from 'taro-ui'
import Input from '../../../../components/Input';
import {
    getAvPriceOfElePur,
    getAllWaterAvPriceOfElePur
} from '../../../../utils/formula';
import inject from '../../../../utils/inject'
import reduxHelper from '../../../../utils/reduxHelper'
import { validate } from '../../../../utils'

@inject('powerExpect', 'firePrice', 'newestTransmissionPrice', 'newestCataloguePrice', 'next', 'powerCosts', 'reLocateButton')
class UnPartake extends Component {
    state = {
        checkedList: this.props.powerExpect.checkedList || [],
        yearPower: this.props.powerExpect.yearPower || this.props.powerCosts.yearPower || undefined,
        waterPrice: this.props.powerExpect.waterPrice || undefined,
        averagePrice: this.props.powerExpect.averagePrice || 0
    }

    checkboxOption = [
        {
            value: 'joinWater',
            label: '参与全水电交易品种',
        }
    ]
    componentDidMount() {
        const { firePrice } = this.props;
        if (firePrice) {
            this.getAvPrice();
        } else {
            Taro.redirectTo({
                url: 'pages/index'
            });
        }
    }
    componentDidUpdate(){
        this.props.reLocateButton()
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
        const { firePrice } = this.props;
        const { collectionFund } = this.props.newestCataloguePrice;
        let averagePrice;
        if (this.state.checkedList.length > 0) {
            averagePrice = getAllWaterAvPriceOfElePur(this.state.waterPrice, price, collectionFund)
        } else {
            averagePrice = getAvPriceOfElePur(this.state.waterPrice, firePrice, price, collectionFund)
        }
        this.setState({
            averagePrice
        })
    }
    componentWillMount() {
        const { yearPower, waterPrice } = this.state;
        reduxHelper('next', validate(yearPower, waterPrice))
    }
    componentWillUnmount() {
        reduxHelper('powerExpect', { ...this.state })
    }
    componentDidUpdate() {
        const { yearPower, waterPrice } = this.state;
        reduxHelper('next', validate(yearPower, waterPrice))
    }
    render() {
        return (
            <View>
                <View className="card">
                    <AtList>
                        <AtListItem
                            title='预计年度购电量'
                            extraText={
                                <Input
                                    type="number"
                                    className="power-input"
                                    title="万千瓦时"
                                    border={false}
                                    value={this.state.yearPower}
                                    digit={4}
                                    onChange={this.handleInputChange.bind(null, 'yearPower')} />
                            }
                        />
                        <AtListItem
                            title='签约水电价格'
                            hasBorder={false}
                            extraText={
                                <Input
                                    type="number"
                                    className="power-input"
                                    title="元/千瓦时"
                                    border={false}
                                    value={this.state.waterPrice}
                                    digit={5}
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
                                <Input
                                    disabled
                                    className="power-input"
                                    title="元/千瓦时"
                                    type="number"
                                    border={false}
                                    digit={5}
                                    value={this.state.averagePrice} />
                            }
                        />
                    </AtList>
                </View>
            </View>)
    }
}

export default UnPartake;