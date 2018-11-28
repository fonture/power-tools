import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Button from '../../components/Button';
import Proportion from '../../components/Proportion';
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { AtList, AtListItem, AtDivider, AtCurtain } from 'taro-ui';
import './index.less'

const cryImage = require('../../assets/images/cry.png');
const smlieImage = require('../../assets/images/smile.png');
@inject()
export default class Form extends Component {
    config = {
        navigationBarTitleText: '结果页'
    }
    tryAgain = () => {
        Taro.redirectTo({ url: 'pages/index' })
    }
    generateReport = () => {
        Taro.redirectTo({ url: 'pages/resultCanvas/index' })
    }
    render() {
        return (
            <View className='result page'>
                <View className='result-wrp'>
                    <View className="result-header">
                        <Text className="title">根据您提供的数据，分析结果为</Text>
                        <img src={cryImage} className="result-img"/>
                        <h3>不建议参加市场化交易</h3>
                    </View>
                    <View className="card">
                        <AtList>
                            <AtListItem
                                extraText="0.01204元"
                                title='平均每度电节约'
                            />
                            <AtListItem
                                extraText="241021元"
                                title='预计节约年度电费'
                            />
                            <AtListItem
                                extraText="50万千瓦时"
                                title='购电量增加'
                                hasBorder={false}
                            />
                        </AtList>
                    </View>
                </View>
                <Button onClick={this.tryAgain} type="secondary">再试一次</Button>
                <Button onClick={this.generateReport} type="primary">生成报告</Button>
            </View>
        )
    }
}

