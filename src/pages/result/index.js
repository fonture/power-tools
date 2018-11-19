import Taro, { Component } from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import Button from '../../components/Button';
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { AtList, AtListItem, AtDivider } from 'taro-ui';
import './index.less'

const cryImage = require('../../assets/cry.png');
const smlieImage = require('../../assets/smile.png');
@inject()
export default class Form extends Component {

    config = {
        navigationBarTitleText: '结果页'
    }
    tryAgain = () => {
        Taro.redirectTo({ url: 'pages/index/index' })
    }
    generateReport = () => {
        console.log('生成报告');
    }
    render() {
        return (
            <View className='result page'>
                <View className='result-wrp'>
                    <Text>根据您提供的数据，分析结果为</Text>
                    <img src={smlieImage} />
                    <h3>参与市场化交易很划算！</h3>
                    <AtDivider />
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
                <Button onClick={this.tryAgain} type="secondary">再试一次</Button>
                <Button onClick={this.generateReport} type="primary">生成报告</Button>
            </View>
        )
    }
}

