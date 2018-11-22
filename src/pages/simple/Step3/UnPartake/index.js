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

export default class UnPartake extends Component {
    checkboxOption = [
        {
            value: 'list1',
            label: '参与全水电交易品种',
        }
    ]
    render() {
        return (
            <View>
                <View className="card">
                    <AtList>
                        <AtListItem
                            title='预计年度购电量：'
                            extraText={
                                <AtInput
                                    type="number"
                                    className="power-input"
                                    title="万千瓦时"
                                    border={false} />
                            }
                        />
                        <AtListItem
                            title='签约水电价格：'
                            hasBorder={false}
                            extraText={
                                <AtInput
                                    type="number"
                                    className="power-input"
                                    title="万千瓦时"
                                    border={false} />
                            }
                        />
                    </AtList>
                </View>
                <View className="card">
                    <AtList>
                        <AtListItem
                            title={
                                <AtCheckbox
                                options={this.checkboxOption}
                              />
                            }
                        />
                        <AtListItem
                            title='购电均价：'
                            hasBorder={false}
                            extraText={
                                <AtInput
                                    disabled
                                    type="number"
                                    className="power-input"
                                    title="元/千瓦时"
                                    border={false} />
                            }
                        />
                    </AtList>
                </View>
            </View>)
    }    
}