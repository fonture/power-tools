import Taro, { Component } from '@tarojs/taro'
import { View, Text, Button, Input } from '@tarojs/components'
import './index.less'
import { withStore } from '../../store';

class Form extends Component {

    config = {
        navigationBarTitleText: '表单页'
    }
    state = {
        name: '',
    }
    handleChange = (e) => {
        this.setState({
            value: e.target.value
        })
    }
    handleClick = () => {
        const { setStore } = this.props.store;
        setStore('data', {
            name: this.state.value
        })
        Taro.navigateTo({
            url: '/pages/result/index'
        })
    }
    render() {
        return (
            <View className='form'>
                <Text onClick={this.handleLinkTo}>表单页</Text>
                <Input onChange={this.handleChange} placeholder="请输入" />
                <Button onClick={this.handleClick}>生成</Button>
            </View>
        )
    }
}

export default withStore(Form);