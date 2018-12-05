import Taro, { Component } from '@tarojs/taro'
import { View, ScrollView } from '@tarojs/components'
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import Steps from '../../components/Steps'
import Button from '../../components/Button'
import './index.less'
import TaroAmin from '../../components/taro-amin'
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
@inject('stepInfo','next')
export default class Form extends Component {

    config = {
        navigationBarTitleText: '表单页'
    }
    state = {
        step: 1,
        action: 'enter'
    }

    componentDidMount() {
        reduxHelper('stepInfo', { current: 0, items: ['基础信息', '用电成本', '购电计算'] })
    }
    componentDidUpdate() {
        // 视口区高度
        const clientHeight = document.documentElement.clientHeight
        // 按钮组距离顶部的距离

        const dom = this._rendered.dom.querySelector('.btn-group')
        const offsetTop = dom.offsetTop

        // 如果按钮组距离顶部的距离加上按钮组的高度没有超过可视区的高度，则按钮组相对于底部绝对定位
        if(offsetTop + 32 * 2 + 80 < clientHeight) {
            dom.style.position = 'fixed'
            dom.style.bottom = 0
            dom.style.margin = '0 auto'
            
        }
    }
    preStep = () => {
        this.state.step === 1 ?
            Taro.redirectTo({ url: 'pages/index' }) :
            this.setState({ step: this.state.step - 1, action: 'back' });
        reduxHelper('stepInfo', { current: this.state.step - 2, items: ['基础信息', '用电成本', '购电计算'] })
    }
    nextStep = () => {
        this.state.step === 3 ?
            Taro.redirectTo({ url: 'pages/result/index' }) :
            this.setState({ step: this.state.step + 1, action: 'enter' });
        reduxHelper('stepInfo', { current: this.state.step, items: ['基础信息', '用电成本', '购电计算'] })
        reduxHelper('next', false)
    }
    render() {
        const { stepInfo = {},next = false } = this.props
        return (
            <ScrollView className='form page'>
                <Steps current={stepInfo.current} items={stepInfo.items} />
                <Content step={this.state.step} action={this.state.action} />
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
            <View>
                {
                    TaroAmin(Comp, this.props)
                }
            </View>
        )
    }
}
