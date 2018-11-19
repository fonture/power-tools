import Taro, { Component } from '@tarojs/taro'
import { View, Text, ScrollView } from '@tarojs/components'
import Button from '../../components/Button';
import Proportion from '../../components/Proportion';
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { AtList, AtListItem, AtDivider, AtButton } from 'taro-ui';
import html2canvas from 'html2canvas';
import './index.less'

const cryImage = require('../../assets/cry.png');
const smlieImage = require('../../assets/smile.png');
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
                <AtButton className="close" onClick={this.onClose}>x</AtButton>
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
                    <AtDivider />
                    <View>
                        <Text>
                            用户属于电压等级为1-10千伏的大工业用电用户，当前没有参与市场化交易，年度用电均价为0.01231元/千瓦时。
                            如果参与市场化交易，购买常规直购电，预估购电均价为0.21541元/千瓦时，平均每度电预计将亏损0.01204元。根据预估的购电量情况，年度电费预计亏损241021元。
                        </Text>
                    </View>
                    <AtDivider />
                    <View>
                        <h3>用电峰平谷比例</h3>
                        <Proportion data={[67, 22, 11]} />
                    </View>
                    <AtDivider />
                </View>
            </ScrollView>
        )
    }
}

