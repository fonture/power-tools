import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView, AtToast } from '@tarojs/components'
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import { reLocateButton } from '../../utils'
import Steps from '../../components/Steps'
import Button from '../../components/Button'
import './index.less'
import TaroAmin from '../../components/taro-amin'
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

@inject('stepInfo', 'baseMessage', 'next', 'firePrice')
export default class Form extends Component {

    config = {
        navigationBarTitleText: '表单页'
    }
    state = {
        step: 1,
        action: 'enter'
    }
    componentDidMount() {
        const { firePrice } = this.props
        if (!firePrice) {
            Taro.redirectTo({
                url: 'pages/index'
            }); 
        }
        
        reduxHelper('reLocateButton', reLocateButton.bind(this))
        // 绑定window的resize事件，如果窗口发生了变化，要重新计算“上一步”“下一步”按钮的位置
        reLocateButton.call(this)
        window.onresize = reLocateButton
    }

    componentDidUpdate() {
        reLocateButton.call(this)
    }

    componentWillUnmount() {
        // 组件卸载时要销毁注册的事件
        window.onresize = null
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
        const {baseMessage} = this.props
        const { step } = this.state
        step === 3 ?
            Taro.redirectTo({ url: 'pages/result/index' }) :
            this.setState({ step: step + 1, action: 'enter' });
        reduxHelper('stepInfo', { current: step, items: baseMessage.mart === '参与' ? ['基础信息', '购电成本', '目录电价'] : ['基础信息', '用电成本', '购电计算']})
        reduxHelper('next', false)
    }

    render() {
        const { stepInfo ,next = false } = this.props
        return (
            <ScrollView className='form page'>
                <Steps current={stepInfo.current} items={stepInfo.items} />
                <Content
                    step={this.state.step}
                    action={this.state.action} />
                <View className="btn-group">
                    <Button onClick={this.preStep} type="secondary">上一步</Button>
                    <Button onClick={this.nextStep} type="primary" disabled={!next}>下一步</Button>
                </View> 
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
