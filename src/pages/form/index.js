import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import Steps from '../../components/steps'
import Button from '../../components/Button'
import './index.less'
import { extend } from 'nerv-utils';

@inject('stepInfo')
export default class Form extends Component {

    config = {
        navigationBarTitleText: '表单页'
    }
    state = {
        step: 1
    }
    componentDidMount() {
        reduxHelper('stepInfo', {current: 0, items: ['基础信息', '用电成本','购电计算']})
    }
    preStep = () => {
        this.state.step === 1 ?
            Taro.redirectTo({ url: 'pages/index/index' }) :
            this.setState({ step: this.state.step - 1 });
        reduxHelper('stepInfo', {current: this.state.step - 2, items: ['基础信息', '用电成本','购电计算']})
    }
    nextStep = () => {
        this.state.step === 3 ?
            Taro.redirectTo({ url: 'pages/result/index' }) :
            this.setState({ step: this.state.step + 1 });
        reduxHelper('stepInfo', {current: this.state.step, items: ['基础信息', '用电成本','购电计算']})
    }
    render() {
        const { edition } = this.$router.params
        const { stepInfo } = this.props
        return (
            <View className='form page'>
                <Steps current={stepInfo.current} items={stepInfo.items}/>
                <Content step={this.state.step} />
                <Button onClick={this.preStep} type="secondary">上一步</Button>
                <Button onClick={this.nextStep} type="primary">下一步</Button>
            </View>
        )
    }
}

class Content extends Component {
    state = {
        Comp: null
    }
    async componentWillReceiveProps(next) {
        const Comp = await import(`./Step${next.step}`);
        this.setState({Comp:Comp.default});
    }
    async componentWillMount() {
        const Comp = await import(`./Step${this.props.step}`);
        this.setState({Comp:Comp.default});
    }
    render() {
        const { Comp } = this.state;
        return (
            <View>
                <Comp />
            </View>
        )
    }
}
