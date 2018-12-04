import Taro, { Component } from '@tarojs/taro'
import { View, Text, Form } from '@tarojs/components'
import Button from '../../components/Button';
import Proportion from '../../components/Proportion';
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { AtList, AtListItem, AtModal, AtModalContent, AtModalHeader, AtInput, AtButton } from 'taro-ui';
import { keepDecimal, deepExtract } from '../../utils'
import './index.less'

const cryImage = require('../../assets/images/cry.png');
const smlieImage = require('../../assets/images/smile.png');
@inject('baseMessage', 'powerExpect', 'powerCosts', 'powerCalc', 'powerCostsOfHigh', 'version')
export default class Result extends Component {
    config = {
        navigationBarTitleText: '结果页'
    }
    state = {
        modelVis: false,
        selling: '',
        electricity: '',
        canSubmit: false
    }
    data = {}
    tryAgain = () => {
        Taro.redirectTo({ url: 'pages/index' })
    }
    compAP = () => {
        if (this.props.version === 'higher') {
            let step2AP = Number(this.props.powerCostsOfHigh.averagePrice),
                step3AP = Number(this.props.powerCalc[this.props.powerCalc.type].average) || 0;
            return keepDecimal(step2AP - step3AP, 5)
        } else {
            let step2AP = Number(this.props.powerCosts.averagePrice),
                step3AP = Number(this.props.powerExpect.averagePrice);
            return keepDecimal(step2AP - step3AP, 5)
        }
    }
    compTP = (ap) => {
        if (this.props.version === 'higher') {
            let data = this.props.powerCalc[this.props.powerCalc.type];
            let yearPower;
            if (data.isMonthlyFill) {
                yearPower = data.monthlyPower.data.reduce((pre, item) => {
                    if (item.finished) {
                        let num = 0;
                        !!deepExtract(item, 'data.powerVolume.value') && (num += Number(deepExtract(item, 'data.powerVolume.value')));
                        !!deepExtract(item, 'data.surplusPowerVolume.value') && (num += Number(deepExtract(item, 'data.surplusPowerVolume.value')));
                        return pre + num
                    } else {
                        return pre
                    }
                }, 0)
            } else {
                yearPower = Number(data.yearlyData.powerVolume.value)
            }
            let tp = yearPower * ap * 10000
            return {
                tp: keepDecimal(tp, 0),
                step3yp: yearPower
            }
        } else {
            let yearPower = Number(this.props.powerExpect.yearPower);
            let tp = yearPower * ap * 10000;
            return {
                tp: keepDecimal(tp, 0),
                step3yp: yearPower
            }
        }
    }
    getPowerChange = (step3yp) => {
        if (this.props.version !== 'higher') {
            let step2powerChange = this.props.powerCosts.yearPower;
            let step3powerChange = this.props.powerExpect.yearPower;
            let powerChange = keepDecimal((step2powerChange - step3powerChange), 4);
            let ch = powerChange < 0 ? '增加' : '减少';

            return {
                ch,
                powerChange: Math.abs(powerChange)
            }
        } else {
            let step2powerChange = Number(this.props.powerCostsOfHigh.yearPower);
            let step3powerChange = step3yp;
            let powerChange = keepDecimal((step2powerChange - step3powerChange), 4);
            let ch = powerChange < 0 ? '增加' : '减少';

            return {
                ch,
                powerChange: Math.abs(powerChange)
            }
        }
    }
    componentWillUnmount() {
        const { electricity, selling } = this.state;
        this.data = Object.assign(this.data, { electricity, selling })
        reduxHelper('result', this.data)
    }
    showModel = () => {
        this.setState({
            modelVis: true
        })
    }
    handleClose = () => {
        this.setState({
            modelVis: false
        })
    }
    handleSubmit = () => {
        Taro.redirectTo({ url: 'pages/resultCanvas/index' })
    }
    handleChangeValue = (type, value) => {
        this.setState({
            [type]: value
        }, () => {
            this.setState({
                canSubmit: this.state.electricity && this.state.selling
            })
        })
    }
    render() {
        let ap = this.compAP();
        let { tp, step3yp } = this.compTP(ap);
        let { ch, powerChange } = this.getPowerChange(step3yp);
        this.data = { ap, tp, ch, powerChange, step3yp }

        const { modelVis } = this.state;
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
                                    extraText={<span><span style={{ color: '#262828' }}>{powerChange}</span> 万千瓦时</span>}
                                    title={`购电量${ch}`}
                                    hasBorder={false}
                                />
                            }
                        </AtList>
                    </View>
                </View>

                <AtModal
                    isOpened={modelVis}
                    onClose={this.handleClose}
                    onCancel={this.handleClose}
                    onConfirm={this.handleClose}
                    className='formContent'
                >
                    <AtModalHeader>
                        生成报告
                    </AtModalHeader>
                    <AtModalContent>
                        <AtInput
                            name='electricity'
                            title='用电公司'
                            type='text'
                            value={this.state.electricity}
                            onChange={this.handleChangeValue.bind(null, 'electricity')}
                        />
                        <AtInput
                            name='selling'
                            title='售电公司'
                            type='text'
                            value={this.state.selling}
                            onChange={this.handleChangeValue.bind(null, 'selling')}
                        />
                        <AtButton className='sumitButton' disabled={!this.state.canSubmit} onClick={this.handleSubmit}>确定</AtButton>
                    </AtModalContent>
                </AtModal>

                <Button onClick={this.tryAgain} type="secondary">再试一次</Button>
                <Button onClick={this.showModel} type="primary">生成报告</Button>
            </View>
        )
    }
}

