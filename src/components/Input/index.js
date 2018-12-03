import Taro, { Component } from '@tarojs/taro'
import { AtInput } from 'taro-ui';

// digit 小数位数
const keepDecimalOfString = (str, digit=4) => {
    if (str) {
        if (str.includes('.')) {
            const [a, b] = str.split('.');
            return `${a}.${b.substring(0, digit)}`;
        } else {
            return str
        }
    } else {
        return ''
    }
}
class Input extends Component {

    onChange = (value) => {
        this.props.onChange(keepDecimalOfString(value, this.props.digit));
    }
    render() {
        const { onChange, ...porps } = this.props;
        return (
            <AtInput {...porps} onChange={this.onChange} />
        )
    }
}

export default Input