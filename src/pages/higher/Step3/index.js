import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtSwitch, AtList, AtListItem, AtActionSheet, AtActionSheetItem, AtInput } from "taro-ui"
import inject from '../../../utils/inject';
import MonthButton from '../MonthPlugin/MonthButton';
import reduxHelper from '../../../utils/reduxHelper'
import InputPanel from './InputPanel'
import './index.less'
import { type } from 'os';


@inject('tradingVarieties', 'powerCalc')
export default class Step3 extends Component {

  state = {
    isOpened: false,
    isChecked: false,
    powerCalc: this.props.powerCalc
  }

  componentDidMount() {
    this.props.onDidMount(this._rendered.dom);
  }

  triggerActionSheet = (bool = true) => {
    this.setState({
      isOpened: !!bool,
    })
  }

  toggleMonthlyCheck = (isChecked) => {
    const { powerCalc } = this.props;
    const { type } = powerCalc;
    powerCalc[type].isMonthlyFill = isChecked;
    reduxHelper('powerCalc', powerCalc);
    this.setState({
      isChecked,
    })
  }


  handleClose = () => {
    this.setState({
      isOpened: false,
    })
  }

  handleItemSelected = (e, key) => {
    const { powerCalc } = this.props;
    powerCalc.type = key
    reduxHelper('powerCalc', powerCalc);
    this.setState({
      isOpened: false
    })
  }

  updateAllData = () => {
    this.setState({})
  }

  render() {
    const { tradingVarieties } = this.props;
    const { isOpened, isChecked, powerCalc } = this.state;
    const { type, singleRegular, singleProtocol, RegularAndSurplus, protocolAndSurplus } = powerCalc
    return (
      <View>

        <div className="power-purchase-calculation card">
          <AtList>
            <AtListItem title='交易品种' extraText={tradingVarieties[powerCalc.type]} arrow='right' onClick={this.triggerActionSheet} />
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
                ? <MonthButton data={powerCalc} updateData={this.updateAllData}/>
                : null
              } 
              {/* 输入面板 */}
                <InputPanel data={powerCalc} />
              {/* 结果展示 */}
          </AtCard>

          <AtActionSheet isOpened={isOpened}
          onClose={this.handleClose}
          >
            {
              Object.keys(tradingVarieties).map(key => (
                <AtActionSheetItem onClick={(e)=>this.handleItemSelected(e, key)}>
                  {tradingVarieties[key]}
                </AtActionSheetItem>
              ))
            }
          </AtActionSheet>

        </div>

      </View>
    )
  }
}
