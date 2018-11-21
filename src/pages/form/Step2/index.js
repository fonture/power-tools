import Taro, { Component } from '@tarojs/taro'
import PropTypes from 'prop-types'
import { View } from '@tarojs/components'
import ElectricityCost from './ElectricityCost'
import BuyPowerCost from './BuyPowerCost'
import './index.less'

export default class Step2 extends Component {
    
    render() {
        const { join } = this.props
        return (
            <View>
            {
                join
                ? <BuyPowerCost />
                : <ElectricityCost />
            }
            </View>
        )
    }
}

Step2.defaultProps = {
    join: true
}

Step2.propTypes = {
    join: PropTypes.bool
}