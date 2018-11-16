import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import reduxHelper from '../../utils/reduxHelper'
import { connect } from '@tarojs/redux'
import './index.less'

const mapStateToProps = (store) => {
    const { count } = store
    if (count && JSON.stringify(count) !== '{}') {
        return {
            count: count.value
        }
    }
}

@connect(mapStateToProps)
export default class Form extends Component {

    config = {
        navigationBarTitleText: '表单页'
    }
    state = {
        step: 1
    }
    preStep = () => {
        this.state.step === 1 ?
            Taro.redirectTo({ url: 'pages/index/index' }) :
            this.setState({ step: this.state.step - 1 });
    }
    nextStep = () => {
        this.state.step === 3 ?
            Taro.redirectTo({ url: 'pages/result/index' }) :
            this.setState({ step: this.state.step + 1 });
    }
    render() {
        const { edition } = this.$router.params
        return (
            <View className='form'>
                <h3>{edition}版</h3>
                <h3 className="title">第{this.state.step}步</h3>
                <Button onClick={this.preStep}>上一步</Button>
                <Button onClick={this.nextStep}>下一步</Button>
            </View>
        )
    }
}

