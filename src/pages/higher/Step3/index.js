import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtSwitch, AtList, AtListItem, AtActionSheet, AtActionSheetItem, AtInput } from "taro-ui"
import MonthPlugin from '../MonthPlugin'
import inject from '../../../utils/inject';
import reduxHelper from '../../../utils/reduxHelper'
import MonthButton from '../MonthPlugin/monthButton';
import './index.less'


@inject('tradingVarieties', 'powerCalc')
export default class Step3 extends Component {

  state = {
    isOpened: false,
    isChecked: false,
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

  render() {
    const { tradingVarieties, powerCalc } = this.props;
    const { isOpened, isChecked } = this.state;

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
            {
              // to do
            }
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
