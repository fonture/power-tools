import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import Button from '../../components/Button';
import reduxHelper from '../../utils/reduxHelper'
import inject from '../../utils/inject'
import './index.less'

@inject()
export default class Form extends Component {

    config = {
        navigationBarTitleText: '结果页'
    }
    tryAgain = () => {
        Taro.redirectTo({ url: 'pages/index/index' })
    }
    generateReport = () => {
        console.log('生成报告');
    }
    render() {
        return (
            <View className='result page'>
                <h3 className="title">不建议参与市场化交易</h3>
                <Button onClick={this.tryAgain} type="secondary">再试一次</Button>
                <Button onClick={this.generateReport} type="primary">生成报告</Button>
            </View>
        )
    }
}

