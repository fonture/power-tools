import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Button from '../../components/Button';
import Proportion from '../../components/Proportion';
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { AtList, AtListItem, AtDivider, AtCurtain } from 'taro-ui';
import { keepDecimal } from '../../utils'
import './index.less'

const cryImage = require('../../assets/images/cry.png');
const smlieImage = require('../../assets/images/smile.png');
@inject('baseMessage', 'powerExpect', 'powerCosts')
export default class Result extends Component {
    config = {
        navigationBarTitleText: '结果页'
    }
    data = {}
    tryAgain = () => {
        Taro.redirectTo({ url: 'pages/index' })
    }
    generateReport = () => {
        Taro.redirectTo({ url: 'pages/resultCanvas/index' })
    }
    compAP = () => {
        let { mart } = this.props.baseMessage;
        let step2AP = this.props.powerCosts.averagePrice,
            step3AP = this.props.powerExpect.averagePrice;
        return keepDecimal(step2AP - step3AP, 5)
    }
    compTP = (ap) => {
        let tp = this.props.powerExpect.yearPower * ap
        return keepDecimal(tp, 0)
    }
    getPowerChange = () => {
        let { mart } = this.props.baseMessage;
        let step2powerChange = this.props.powerCosts.yearPower;
        let step3powerChange = this.props.powerExpect.yearPower;
        let powerChange = step2powerChange - step3powerChange;
        let ch = powerChange > 0 ? '增加' : '减少';

        return {
            ch,
            powerChange: Math.abs(powerChange)
        }
    }
    componentWillUnmount() {
        reduxHelper('result', this.data)
    }
    render() {
        let ap = this.compAP();
        let tp = this.compTP(ap);
        let { ch, powerChange } = this.getPowerChange();
        this.data = { ap, tp, ch, powerChange }
        return (
            <View className='result page'>
                <View className='result-wrp'>
                    <View className="result-header">
                        <Text className="title">根据您提供的数据，分析结果为</Text>
                        <img src={ap > 0 ? smlieImage : cryImage} className="result-img" />
                        <h3 style={{ color: ap > 0 ? '#27F47A' : '#F85A24' }}>{ap > 0 ? '参加市场化交易很划算！' : '不建议参加市场化交易'}</h3>
                    </View>
                    <View className="card">
                        <AtList>
                            <AtListItem
                                extraText={<span><span style={{ color: ap > 0 ? '#27F47A' : '#F85A24' }}>{ap}</span> 元</span>}
                                title='平均每度电节约'
                            />
                            <AtListItem
                                extraText={<span><span style={{ color: ap > 0 ? '#27F47A' : '#F85A24' }}>{tp}</span> 元</span>}
                                title='预计节约年度电费'
                            />
                            {
                                powerChange !== 0 && <AtListItem
                                    extraText={<span><span style={{ color:'#262828'}}>{powerChange}</span> 万千瓦时</span>}
                                    title={`购电量${ch}`}
                                    hasBorder={false}
                                />
                            }
                        </AtList>
                    </View>
                </View>
                <Button onClick={this.tryAgain} type="secondary">再试一次</Button>
                <Button onClick={this.generateReport} type="primary">生成报告</Button>
            </View>
        )
    }
}

