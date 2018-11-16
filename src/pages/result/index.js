import Taro, { Component } from '@tarojs/taro'
import { View, Button } from '@tarojs/components'
import reduxHelper from '../../utils/reduxHelper'
import { connect } from '@tarojs/redux'
import './index.less'

const mapStateToProps = (store) => { store }

@connect(mapStateToProps)
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
            <View className='form'>
                <h3 className="title">不建议参与市场化交易</h3>
                <Button onClick={this.tryAgain}>再试一次</Button>
                <Button onClick={this.generateReport}>生成报告</Button>
            </View>
        )
    }
}

