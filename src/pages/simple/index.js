import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { report } from '../../utils'
import Steps from '../../components/steps'
import Button from '../../components/Button'
import './index.less'
import TaroAmin from '../../components/taro-amin'
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
@inject('stepInfo', 'baseMessage')
export default class Form extends Component {

    config = {
        navigationBarTitleText: '表单页'
    }
    state = {
        step: 1,
        action: 'enter'
    }
    // 事件队列
    events = []

    componentDidMount() {
        reduxHelper('stepInfo', { current: 0, items: ['基础信息', '第二步', '第三步'] })
    }

    addEvent = fn => {
        typeof fn === 'function' && this.events.push(fn)
    }

    preStep = () => {
        this.events = [];
        this.state.step === 1 ?
            Taro.redirectTo({ url: 'pages/index/index' }) :
            this.setState({ step: this.state.step - 1, action: 'back' }, () => {
                this.state.step === 1
                ? reduxHelper('stepInfo', { current: 0, items: ['基础信息', '第二步', '第三步'] })
                : reduxHelper('stepInfo', { current: this.state.step - 1, items: this.props.baseMessage.mart === '参与' ? ['基础信息', '购电成本', '目录电价'] : ['基础信息', '用电成本', '购电计算']})
            });
    }
    nextStep = () => {
        this.events.forEach(e => e());
        this.state.step === 3 ?
            Taro.redirectTo({ url: 'pages/result/index' }) :
            this.setState({ step: this.state.step + 1, action: 'enter' });
        reduxHelper('stepInfo', { current: this.state.step, items: this.props.baseMessage.mart === '参与' ? ['基础信息', '购电成本', '目录电价'] : ['基础信息', '用电成本', '购电计算']})
    }
    render() {
        const { stepInfo } = this.props
        return (
            <ScrollView className='form page'>
                <Steps current={stepInfo.current} items={stepInfo.items} />
                <Content
                    step={this.state.step}
                    action={this.state.action}
                    onAddEvent={this.addEvent} />
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
