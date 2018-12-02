import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtSwitch, AtList, AtListItem, AtActionSheet, AtActionSheetItem, AtInput } from "taro-ui"
import inject from '../../../utils/inject';
import MonthButton from '../MonthPlugin/MonthButton';
import './index.less'
import { type } from 'os';


@inject('tradingVarieties', 'powerCalc')
export default class Step3 extends Component {

  state = {
    isOpened: false,
    isChecked: false,
    selectedTrading: this.props.tradingVarieties[0]['name'] || '',
    powerCalc: this.props.powerCalc
  }

  componentDidMount() {
    console.log(this);
    this.props.onDidMount(this._rendered.dom);
  }

  triggerActionSheet = (bool = true) => {
    this.setState({
      isOpened: !!bool,
    })
  }

  toggleMonthlyCheck = (isChecked) => {
    this.setState({
      isChecked,
    })
  }


  handleClose = () => {
    this.setState({
      isOpened: false,
    })
  }

  handleItemSelected = (e, value) => {
    this.setState({
      selectedTrading: value,
      isOpened: false
    })
  }

  render() {
    const { tradingVarieties } = this.props;
    const { isOpened, selectedTrading, isChecked, powerCalc } = this.state;
    const { type, singleRegular, singleProtocol, RegularAndSurplus, protocolAndSurplus } = powerCalc

    return (
      <View>

        <div className="power-purchase-calculation card">
          <AtList>
            <AtListItem title='交易品种' extraText={selectedTrading} arrow='right' onClick={this.triggerActionSheet} />
          </AtList>
          <AtCard
            isFull
            extra={
                <AtSwitch
                  className="no-padding"
                  checked={isChecked}
                  onChange={this.toggleMonthlyCheck}
                >
                </AtSwitch>
              }
            title="分月度填写价格"
          >
              {/* 月份组件 */}
              {
                powerCalc[type].isMonthlyFill
                ? <MonthButton data={this.state.powerCalc} />
                : null
              } 
              {/* 输入面板 */}
              {/* 结果展示 */}
          </AtCard>

          <AtActionSheet isOpened={isOpened}
          onClose={this.handleClose}
          >
            {
              tradingVarieties.map(({name}) => (
                <AtActionSheetItem onClick={(e)=>this.handleItemSelected(e, name)}>
                  {name}
                </AtActionSheetItem>
              ))
            }
          </AtActionSheet>

        </div>

      </View>
    )
  }
}
