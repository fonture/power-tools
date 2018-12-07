import Taro, { Component } from '@tarojs/taro'
import { AtInput } from 'taro-ui';

// digit 小数位数
const keepDecimalOfString = (str, digit = 4) => {
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
    onChange = (value, event) => {
        // 对整数位进行判断，如果超过了12位，则直接返回上一次的旧值
        const dotIndex = value.indexOf('.')
        if(dotIndex == -1 && value.length > 12) {
            value = this.props.value
        }
        if(dotIndex != -1 && value.substring(0, dotIndex).length > 12) {
            value = this.props.value
        }
        this.props.onChange(keepDecimalOfString(value, this.props.digit));
    }
    componentDidMount() {
        if (this.props.digit === 0) {
            this._rendered.dom.addEventListener('keydown', (e) => {
                e.returnValue = e.keyCode !== 190
            })
        }
    }
    render() {
        const { onChange, ...porps } = this.props;
        return (
            <AtInput {...porps} onChange={this.onChange}/>
        )
    }
}

export default Input