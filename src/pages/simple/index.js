import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, AtToast } from '@tarojs/components'
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { report } from '../../utils'
import Steps from '../../components/Steps'
import Button from '../../components/Button'
import './index.less'
import TaroAmin from '../../components/taro-amin'
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
@inject('stepInfo', 'baseMessage', 'electricityCostData', 'buyPowerCostData')
export default class Form extends Component {

    config = {
        navigationBarTitleText: '表单页'
    }
    state = {
        step: 1,
        action: 'enter'
    }

    componentDidMount() {
        reduxHelper('stepInfo', { current: 0, items: ['基础信息', '第二步', '第三步'] })
    }

    preStep = () => {
        this.state.step === 1 ?
            Taro.redirectTo({ url: 'pages/index' }) :
            this.setState({ step: this.state.step - 1, action: 'back' }, () => {
                this.state.step === 1
                ? reduxHelper('stepInfo', { current: 0, items: ['基础信息', '第二步', '第三步'] })
                : reduxHelper('stepInfo', { current: this.state.step - 1, items: this.props.baseMessage.mart === '参与' ? ['基础信息', '购电成本', '目录电价'] : ['基础信息', '用电成本', '购电计算']})
            });
    }
    nextStep = () => {
        const {baseMessage, electricityCostData, buyPowerCostData} = this.props
        const { step } = this.state
        // 如果当前是第二步，取对应数据集中的提示信息判断，如果不为空则显示轻提示
        if(step === 2 && baseMessage.mart === '参与' && buyPowerCostData.tip !== '') {
            Taro.showToast({
                icon: 'none',
                title: buyPowerCostData.tip
            })
            return
        }else if(step === 2 && baseMessage.mart === '未参与' && electricityCostData.tip !== '') {
            Taro.showToast({
                icon: 'none',
                title: electricityCostData.tip
            })
            return
        }
        step === 3 ?
            Taro.redirectTo({ url: 'pages/result/index' }) :
            this.setState({ step: step + 1, action: 'enter' });
        reduxHelper('stepInfo', { current: step, items: baseMessage.mart === '参与' ? ['基础信息', '购电成本', '目录电价'] : ['基础信息', '用电成本', '购电计算']})
    }
    render() {
        const { stepInfo } = this.props
        return (
            <ScrollView className='form page'>
                <Steps current={stepInfo.current} items={stepInfo.items} />
                <Content
                    step={this.state.step}
                    action={this.state.action} />
                <Button onClick={this.preStep} type="secondary">上一步</Button>
                <Button onClick={this.nextStep} type="primary">下一步</Button>
            </ScrollView>
        )
    }
}

class Content extends Component {
    state = {
        compList: [
            Step1,
            Step2,
            Step3
        ]
    }
    render() {
        const Comp = this.state.compList[this.props.step - 1];
        return (
            <View className="step">
                {
                    TaroAmin(Comp, this.props)
                }
            </View>
        )
    }
}
