import Taro, { Component } from '@tarojs/taro'
import { AtButton } from 'taro-ui'
import './index.less'

export default class Btn extends Component {
    static options = {
        addGlobalClass: true
    }
    render() {
        const { type, children, onClick, loading, disabled=false } = this.props;
        return (
            <AtButton
                onClick={onClick}
                disabled={disabled}
                type={type}
                loading={loading}
                className="stepBtn"
            >{children}</AtButton>
        )
    }
} 