import Taro, { Component } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import './index.less'

export default class Btn extends Component {
    static options = {
        addGlobalClass: true
    }
    render() {
        console.log('render');
        const {type, children, onClick} = this.props;
        return (
            <AtButton 
            onClick={onClick}
            className={type}
            type={type}
            >{children}</AtButton>
        )
    }
} 