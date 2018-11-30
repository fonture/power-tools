import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Proportion from '../../components/Proportion';
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { AtList, AtListItem, AtDivider, AtIcon } from 'taro-ui';
import ReCharts from './ReCharts';
import html2canvas from 'html2canvas';
import './index.less'

const cryImage = require('../../assets/images/cry.png');
const smlieImage = require('../../assets/images/smile.png');
@inject('result', 'baseMessage', 'powerCosts', 'powerExpect')
class ResultCanvas extends Component {
    config = {
        navigationBarTitleText: '结果页'
    }
    onClose = () => {
        Taro.redirectTo({ url: 'pages/result/index' })
    }
    componentDidMount() {
        // let resultWrp = document.getElementsByClassName('result-wrp')[0];
        // html2canvas(resultWrp).then(canvas => {
        //     resultWrp.style.padding = 0;
        //     resultWrp.innerHTML = '';
        //     resultWrp.appendChild(canvas);
        // });
    }
    render() {
        const { ap, ch, powerChange, tp } = this.props.result; // 结果页数据
        const { mart } = this.props.baseMessage; // 参与未参与
        const { averagePrice: step2av, yearPower: step2yp } = this.props.powerCosts; // 第二步均价
        const { averagePrice: step3av, yearPower: step3yp } = this.props.powerExpect; // 第三步均价
        let versionValue;
        if (this.props.version && Object.keys(this.props.version).length > 0) {
            versionValue = this.props.version.value;
        }
        return (
            <ScrollView className='result page'>
                <AtIcon className="close"
                    onClick={this.onClose}
                    value='close-circle'
                    size='30'
                    color='#1bdce3'>×</AtIcon>
                <View className='result-wrp'>
                    <View className="result-header dash-border">
                        <Text className="title">针对<Text className="company">QWERTY物业管理公司</Text>分析结果为</Text>
                        <img src={ap > 0 ? smlieImage : cryImage} className="result-img" />
                        <h3 style={{ color: ap > 0 ? '#27F47A' : '#F85A24' }}>{ap > 0 ? '参加市场化交易很划算！' : '不建议参加市场化交易'}</h3>
                    </View>
                    <View className="result-body">
                        <View>
                            <AtList hasBorder={false} className="resultCanvas-list container">
                                <AtListItem
                                    title={<Text><img src={require('../../assets/no1.png')} className="stepImg" />平均每度电节约</Text>}
                                    hasBorder={false}
                                    extraText={<span style={{ color: ap > 0 ? '#27F47A' : '#F85A24' }}>{ap} 元</span>}
                                />
                                <AtListItem
                                    title={<Text><img src={require('../../assets/no2.png')} className="stepImg" />预计节约年度电费</Text>}
                                    hasBorder={false}
                                    extraText={<span style={{ color: ap > 0 ? '#27F47A' : '#F85A24' }}>{tp} 元</span>}
                                />
                                {
                                    powerChange !== 0 && <AtListItem
                                        extraText={<span style={{ color: '#fff' }}>{powerChange}万千瓦时</span>}
                                        title={<Text><img src={require('../../assets/no3.png')} className="stepImg" />{`购电量${ch}`}</Text>}
                                        hasBorder={false}
                                    />
                                }
                            </AtList>
                        </View>
                        <AtDivider lineColor="#888888" />
                        <View>
                            {
                                mart === '参与' ?
                                    <Text className="wenan">
                                        <p>用户属于电压等级为<Text className="blue">1-10</Text>千伏的<Text className="blue">大工业用电</Text>用户，当前<Text className="blue">已参加</Text>市场化交易，购买<Text className="blue">{`常规直购电`}</Text>，年度用电均价为<Text className="blue">{step2av}元/千瓦时</Text>。</p>
                                        <p>如果不参与市场化交易，根据其峰平谷比例，预估购电均价为<Text className="blue">{step3av}元/千瓦时</Text>，平均每度电预计将<Text className="red">亏损{ap}元</Text>。根据预估的购电量情况，年度电费预计<Text className="red">亏损{tp}元</Text>。</p>
                                    </Text> :
                                    <Text className="wenan">
                                        <p>用户属于电压等级为<Text className="blue">1-10</Text>千伏的<Text className="blue">大工业用电</Text>用户，当前<Text className="blue">没有参加</Text>市场化交易，年度用电均价为<Text className="blue">{step2av}元/千瓦时</Text>。</p>
                                        <p>如果参与市场化交易，购买常规直购电，预估购电均价为<Text className="blue">{step3av}元/千瓦时</Text>，平均每度电预计将<Text className="red">亏损{ap}元</Text>。根据预估的购电量情况，年度电费预计<Text className="red">亏损{tp}元</Text>。</p>
                                    </Text>
                            }
                        </View>
                        <View className="dash-border proportion-cantainer container">
                            <Text>用电峰平谷比例：</Text>
                            <Proportion data={[67, 22, 11]} />
                        </View>
                        {
                            versionValue === 'higher' && <View className="reCharts-container">
                                <ReCharts />
                                <AtDivider lineColor="#888888" height="5" />
                            </View>
                        }
                        <View className="container">
                            <Text>总用电量（千瓦时）：</Text>
                            <View className='at-row'>
                                <View className='at-col at-col-1 at-col--auto'>
                                    <div className="rangefull" >
                                        <div className="range" style={{ width: (step2yp > step3yp ? 1 : (step2yp / step3yp)) * 100 + '%' }}></div>
                                    </div>
                                </View>
                                <View className='at-col rangeText'>实际用量<Text className={`rangeNum ${step2yp < step3yp && 'pra'}`}>{step2yp}</Text></View>
                            </View>
                            <View className='at-row'>
                                <View className='at-col at-col-1 at-col--auto rangefull'>
                                    <div className="rangefull" >
                                        <div className="range" style={{ width: (step3yp > step2yp ? 1 : (step3yp / step2yp)) * 100 + '%' }}></div>
                                    </div>
                                </View>
                                <View className='at-col rangeText'>预测用量<Text className={`rangeNum ${step3yp < step2yp && 'pra'}`}>{step3yp}</Text></View>
                            </View>
                        </View>
                        <View className="container dash-border">
                            <Text>用电丰枯比（富余电量不纳入计算）：</Text>
                            <View className='at-row proportion-row'>
                                <View className='at-col'>
                                    <div className="num">1.1251</div>
                                    <div className="ch">实际丰枯比</div>
                                </View>
                                <View className='at-col at-col__offset-1'>
                                    <div className="num">1.2047</div>
                                    <div className="ch">预测丰枯比</div>
                                </View>
                                <View className='at-col at-col__offset-1'>
                                    <div className="num">0.8</div>
                                    <div className="ch">K值</div>
                                </View>
                            </View>
                        </View>
                        <View className="result-footer dash-border">
                            <View className='at-row '>
                                <View className='at-col at-col-7'>
                                    <p>长按识别二维码</p>
                                    <p>生成我的购电报告</p>
                                    <p>由<Text className="blue">BABC售电公司</Text>提供本方案</p>
                                </View>
                                <View className='at-col at-col-5'>
                                    <img src={require('../../assets/erweima.png')} className="erweima" />
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
        )
    }
}

export default ResultCanvas;