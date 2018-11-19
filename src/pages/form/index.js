import Taro, { Component } from '@tarojs/taro'
import { View, Button, Text } from '@tarojs/components'
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import './index.less'
import { extend } from 'nerv-utils';

@inject('count')
export default class Form extends Component {

    config = {
        navigationBarTitleText: '表单页'
    }
    state = {
        step: 1
    }
    componentDidMount() {
        reduxHelper('count', {value: 1})
    }
    preStep = () => {
        this.state.step === 1 ?
            Taro.redirectTo({ url: 'pages/index/index' }) :
            this.setState({ step: this.state.step - 1 });
            reduxHelper('count', { value: this.props.count.value - 1 })
    }
    nextStep = () => {
        this.state.step === 3 ?
            Taro.redirectTo({ url: 'pages/result/index' }) :
            this.setState({ step: this.state.step + 1 });
            reduxHelper('count', { value: this.props.count.value + 1 })
    }
    render() {
        const { edition } = this.$router.params
        return (
            <View className='form page'>
                <h3>{edition}版</h3>
                <h3 className="title">第{this.state.step}步</h3>
                <Content step={this.state.step} />
                <Button onClick={this.preStep}>上一步</Button>
                <Button onClick={this.nextStep}>下一步</Button>
                <div>{this.props.count.value}</div>
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
