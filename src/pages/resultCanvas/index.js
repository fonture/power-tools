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
@inject()
export default class Form extends Component {
    config = {
        navigationBarTitleText: '结果页'
    }
    onClose = () => {
        Taro.redirectTo({ url: 'pages/result/index' })
    }
    componentDidMount() {
        let resultWrp = document.getElementsByClassName('result-wrp')[0];
        html2canvas(resultWrp).then(canvas => {
            resultWrp.style.padding = 0;
            resultWrp.innerHTML = '';
            resultWrp.appendChild(canvas);
        });
    }
    render() {
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
                        <img src={cryImage} className="result-img" />
                        <h3>参与市场化交易很划算！</h3>
                    </View>
                    <View className="result-body">
                        <View>
                            <AtList hasBorder={false} className="resultCanvas-list container">
                                <AtListItem
                                    title={<Text><img src={require('../../assets/no1.png')} className="stepImg" />平均每度电节约</Text>}
                                    hasBorder={false}
                                    extraText={<Text className="red">-0.01204元</Text>}
                                />
                                <AtListItem
                                    title={<Text><img src={require('../../assets/no2.png')} className="stepImg" />预计节约年度电费</Text>}
                                    hasBorder={false}
                                    extraText={<Text className="red">-241021元</Text>}
                                />
                                <AtListItem
                                    title={<Text><img src={require('../../assets/no3.png')} className="stepImg" />购电量增加</Text>}
                                    hasBorder={false}
                                    extraText={<Text className="pra">50万千瓦时</Text>}
                                />
                            </AtList>
                        </View>
                        <AtDivider lineColor="#888888" />
                        <View>
                            <Text className="wenan">
                                <p>用户属于电压等级为<Text className="blue">1-10</Text>千伏的<Text className="blue">大工业用电</Text>用户，当前<Text className="blue">没有参加</Text>市场化交易，年度用电均价为0.01231元/千瓦时。</p>
                                <p>如果参与市场化交易，购买常规直购电，预估购电均价为<Text className="blue">0.01231元/千瓦时</Text>，平均每度电预计将<Text className="red">亏损0.01204元</Text>。根据预估的购电量情况，年度电费预计<Text className="red">亏损241021元</Text>。</p>
                            </Text>
                        </View>
                        <View className="dash-border proportion-cantainer container">
                            <Text>用电峰平谷比例：</Text>
                            <Proportion data={[67, 22, 11]} />
                        </View>
                        <View className="reCharts-container">
                            <ReCharts />
                        </View>
                        <AtDivider lineColor="#888888" height="5" />
                        <View className="container">
                            <Text>总用电量（千瓦时）：</Text>
                            <View className='at-row'>
                                <View className='at-col at-col-1 at-col--auto'>
                                    <div className="rangefull" >
                                        <div className="range" style={{ width: (2928 / 2928) * 100 + '%' }}></div>
                                    </div>
                                </View>
                                <View className='at-col rangeText'>实际用量<Text className="rangeNum">2928</Text></View>
                            </View>
                            <View className='at-row'>
                                <View className='at-col at-col-1 at-col--auto rangefull'>
                                    <div className="rangefull" >
                                        <div className="range" style={{ width: (2246 / 2928) * 100 + '%' }}></div>
                                    </div>
                                </View>
                                <View className='at-col rangeText'>预测用量<Text className="rangeNum pra">2246</Text></View>
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

