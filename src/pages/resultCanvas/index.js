import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Proportion from '../../components/Proportion';
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { AtList, AtListItem, AtDivider, AtIcon } from 'taro-ui';
import ReCharts from './ReCharts';
import html2canvas from 'html2canvas';
import './index.less'
import { deepExtract, keepDecimal, toThousands } from '../../utils'
import { gethighDryProportion, getKvalue } from '../../utils/formula'

const cryImage = require('../../assets/images/cry.png');
const smlieImage = require('../../assets/images/smile.png');


const monthToNum = (str) => str.split('月')[0] - 1
const _extractDryAndHighData = (data) => {
    const extra = (item, index) => {
        let { high, medium, low } = item;
        high = high == '' ? 0 : high;
        medium = medium == '' ? 0 : medium;
        low = low == '' ? 0 : low;
        return Number(high) + Number(medium) + Number(low)
    }

    const dry = data.filter((_, index) => {
        return (index >= 0 && index <= 3) || index == 11
    }).map(extra)

    const high = data.filter((_, index) => {
        return index >= 5 && index <= 9
    }).map(extra)

    return [dry, high]
}
@inject('result', 'baseMessage', 'powerCosts', 'powerExpect', 'version', 'powerCostsOfHigh', 'tradingVarieties', 'powerCalc')
class ResultCanvas extends Component {
    config = {
        navigationBarTitleText: '结果页'
    }
    state = {
        actualValue: [],
        expectValue: [],
        monthList: []
    }
    onClose = () => {
        Taro.redirectTo({ url: 'pages/result/index' })
    }
    componentDidMount() {
        // setImmediate(() => {
        //     let resultWrp = document.getElementsByClassName('result-wrp')[0];
        //     html2canvas(resultWrp).then(canvas => {
        //         resultWrp.style.padding = 0;
        //         resultWrp.innerHTML = '';
        //         resultWrp.appendChild(canvas);
        //     });
        // })

    }

    componentWillMount() {
        const actualValue = this.props.powerCostsOfHigh.monthPowerList.map(item => {
            if (item.finished) {
                return [monthToNum(item.name), Number(item.high) + Number(item.medium) + Number(item.low)]
            }
        }).filter(Boolean);
        const expectValue = this.props.powerCalc[this.props.powerCalc.type].monthlyPower.data.map(item => {
            if (item.finished) {
                return [item.month, Number(item.data.powerVolume.value)]
            }
        }).filter(Boolean);
        this.setState({
            actualValue,
            expectValue,
        })
    }
    getResultData = (version) => {
        try {
            const { mart, sortValue } = this.props.baseMessage; // 参与未参与
            const { ap, ch, powerChange, tp, step3yp, electricity, selling } = this.props.result; // 结果页数据
            if (version === 'simple') {
                const { averagePrice: step2av, yearPower: step2yp } = this.props.powerCosts; // 第二步均价
                const { averagePrice: step3av, yearPower: step3yp } = this.props.powerExpect; // 第三步均价
                const buyType = '常规直购电';
                let { high, medium, low } = (mart === '参与' ? this.props.powerExpect : this.props.powerCosts);
                const totalData = Number(high) + Number(medium) + Number(low);
                let highPro = keepDecimal(Number(high) / totalData * 100, 2);
                let mediumPro = keepDecimal(Number(medium) / totalData * 100, 2);
                let lowPro = keepDecimal((100 - highPro - mediumPro), 2);
                const proportionData = [highPro, mediumPro, lowPro];
                return {
                    ap, ch, powerChange, tp, mart, sortValue, step2av, step2yp, step3av, step3yp, buyType, proportionData, electricity, selling
                }
            } else {
                let { highYearPower, lowYearPower, mediumYearPower } = this.props.powerCostsOfHigh;
                const totalData = Number(highYearPower) + Number(mediumYearPower) + Number(lowYearPower);
                let highPro = keepDecimal(Number(highYearPower) / totalData * 100, 2);
                let mediumPro = keepDecimal(Number(mediumYearPower) / totalData * 100, 2);
                let lowPro = keepDecimal((100 - highPro - mediumPro), 2);
                const proportionData = [highPro, mediumPro, lowPro];
                const { averagePrice: step2av, yearPower: step2yp } = this.props.powerCostsOfHigh;
                const { average: step3av, isMonthlyFill } = this.props.powerCalc[this.props.powerCalc.type];
                const buyType = this.props.tradingVarieties[this.props.powerCalc.type];
                return {
                    proportionData,
                    mart, sortValue,
                    ap, ch, powerChange, tp,
                    step2av, step2yp,
                    step3av, step3yp,
                    buyType,
                    electricity, selling,
                    isMonthlyFill
                }
            }            
        } catch (error) {
            Taro.redirectTo({
                url: 'pages/index'
            });            
        }

    }
    getRatio = () => {
        let data = this.props.powerCalc[this.props.powerCalc.type]
        let step3Ratio = data.ratio;
        let step2Ratio = gethighDryProportion(_extractDryAndHighData(this.props.powerCostsOfHigh.monthPowerList));
        let yearPower = data.monthlyPower.data.reduce((pre, item) => {
            if (item.finished) {
                let num = 0;
                !!deepExtract(item, 'data.powerVolume.value') && (num += Number(deepExtract(item, 'data.powerVolume.value')));
                return pre + num
            } else {
                return pre
            }
        }, 0)
        let plain = data.monthlyPower.data.reduce((pre, item, index) => {
            if (index == 4 || index == 10) {
                let value = item.data.powerVolume.value
                return pre + Number(!!value ? value : 0)
            } else {
                return pre
            }
        }, 0) / yearPower;
        let drain = data.monthlyPower.data.reduce((pre, item, index) => {
            if ((index >= 0 && index <= 3) || index == 11) {
                let value = item.data.powerVolume.value
                return pre + Number(!!value ? value : 0)
            } else {
                return pre
            }
        }, 0) / yearPower;
        let Kvalue = getKvalue(plain, drain);
        return { step2Ratio, step3Ratio, Kvalue }
    }
    render() {
        const versionValue = this.props.version; // 版本信息
        const { ap, ch, powerChange, tp, mart, sortValue, step2av, step2yp, step3av, step3yp, buyType, proportionData, electricity, selling, isMonthlyFill } = this.getResultData(versionValue)
        const { actualValue, expectValue, monthList } = this.state;
        const { step2Ratio, step3Ratio, Kvalue } = this.getRatio();
        return (
            <ScrollView className='result page'>
                <View className='result-wrp'>
                    <View className="result-header dash-border">
                        <Text className="title">针对<Text className="company">{electricity}</Text>分析结果为</Text>
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
                                    extraText={<span style={{ color: ap > 0 ? '#27F47A' : '#F85A24' }}>{toThousands(tp)} 元</span>}
                                />
                                {
                                    powerChange !== 0 && <AtListItem
                                        extraText={<span style={{ color: '#fff' }}>{powerChange} 万千瓦时</span>}
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
                                        <p>用户属于电压等级为<span style={{color:'#24FCFF'}}>{sortValue[1]}</span>的<span style={{color:'#24FCFF'}}>{sortValue[0]}</span>用户，当前<span style={{color:'#24FCFF'}}>已参加</span>市场化交易，购买<span style={{color:'#24FCFF'}}>{buyType}</span>，年度用电均价为<span style={{color:'#24FCFF'}}>{step2av}元/千瓦时</span>。</p>
                                        <p>如果不参与市场化交易，根据其峰平谷比例，预估购电均价为<span style={{color:'#24FCFF'}}>{step3av}元/千瓦时</span>，平均每度电预计将<span style={{ color: ap > 0 ? '#27F47A' : '#F85A24' }}>{ap > 0 ? '节约' : '亏损'}{Math.abs(ap)}元</span>。根据预估的购电量情况，年度电费预计<span style={{ color: tp > 0 ? '#27F47A' : '#F85A24' }}>{tp > 0 ? '节约' : '亏损'}{toThousands(Math.abs(tp))}元</span>。</p>
                                    </Text> :
                                    <Text className="wenan">
                                        <p>用户属于电压等级为<span style={{color:'#24FCFF'}}>{sortValue[1]}</span>的<span style={{color:'#24FCFF'}}>{sortValue[0]}</span>用户，当前<span style={{color:'#24FCFF'}}>没有参加</span>市场化交易，年度用电均价为<span style={{color:'#24FCFF'}}>{step2av}元/千瓦时</span>。</p>
                                        <p>如果参与市场化交易，购买<span style={{color:'#24FCFF'}}>{buyType}</span>，预估购电均价为<span style={{color:'#24FCFF'}}>{step3av}元/千瓦时</span>，平均每度电预计将<span style={{ color: ap > 0 ? '#27F47A' : '#F85A24' }}>{ap > 0 ? '节约' : '亏损'}{Math.abs(ap)}元</span>。根据预估的购电量情况，年度电费预计<span style={{ color: tp > 0 ? '#27F47A' : '#F85A24' }}>{tp > 0 ? '节约' : '亏损'}{Math.abs(tp)}元</span>。</p>
                                    </Text>
                            }
                        </View>
                        {
                            mart !== '参与' && <View className="dash-border proportion-cantainer container">
                                <Text>用电峰平谷比例：</Text>
                                <Proportion data={proportionData} />
                            </View>
                        }

                        {
                            versionValue === 'higher' && <View className="reCharts-container">
                                <ReCharts actualValue={actualValue} expectValue={expectValue} monthList={monthList} />
                                <AtDivider lineColor="#888888" height="5" />
                            </View>
                        }
                        <View className="container">
                            <Text>总用电量（万千瓦时）：</Text>
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
                        {
                            isMonthlyFill && <View className="container dash-border">
                                <Text>用电丰枯比（富余电量不纳入计算）：</Text>
                                <View className='at-row proportion-row'>
                                    <View className='at-col'>
                                        <div className="num">{step2Ratio}</div>
                                        <div className="ch">实际丰枯比</div>
                                    </View>
                                    <View className='at-col at-col__offset-1'>
                                        <div className="num">{step3Ratio}</div>
                                        <div className="ch">预测丰枯比</div>
                                    </View>
                                    <View className='at-col at-col__offset-1'>
                                        <div className="num">{Kvalue}</div>
                                        <div className="ch">K值</div>
                                    </View>
                                </View>
                            </View>
                        }
                        <View className="result-footer dash-border">
                            <View className='at-row '>
                                <View className='at-col at-col-7'>
                                    <p>长按识别二维码</p>
                                    <p>生成我的购电报告</p>
                                    <p>由<Text className="blue">{selling}</Text>提供本方案</p>
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