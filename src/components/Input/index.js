import Taro, { Component } from '@tarojs/taro'
import { AtInput } from 'taro-ui';
import { keepDecimal } from '../../utils';

// digit 小数位数
class Input extends Component {
    render() {
        let value = keepDecimal(this.props.value, this.props.digit);
        let props = Object.assign(this.props, { value });
        return (
            <AtInput {...props} />
        )
    }
}

export default Input