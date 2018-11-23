import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Button from '../../components/Button';
import Proportion from '../../components/Proportion';
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { AtList, AtListItem, AtDivider, AtCurtain } from 'taro-ui';
import html2canvas from 'html2canvas';
import './index.less'

const cryImage = require('../../assets/cry.png');
const smlieImage = require('../../assets/smile.png');
@inject()
export default class Form extends Component {
    config = {
        navigationBarTitleText: '结果页'
    }
    state = {
        isOpened: false
    }
    onClose = () => {
        this.setState({
            isOpened: false
        })
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
                    <View>
                        <Text>根据您提供的数据，分析结果为</Text>
                        <img src={smlieImage} />
                        <h3>参与市场化交易很划算！</h3>
                    </View>
                    <AtDivider />
                    <View>
                        <AtList hasBorder={false}>
                            <AtListItem
                                extraText="0.01204元"
                                title='平均每度电节约'
                                hasBorder={false}
                            />
                            <AtListItem
                                extraText="241021元"
                                title='预计节约年度电费'
                                hasBorder={false}
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

