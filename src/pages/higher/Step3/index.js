import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtSwitch, AtList, AtListItem, AtActionSheet, AtActionSheetItem, AtInput } from "taro-ui"
import inject from '../../../utils/inject';
import { deepExtract } from '../../../utils';
import MonthButton from '../MonthPlugin/MonthButton';
import reduxHelper from '../../../utils/reduxHelper';
import Card from '../../../components/Card';
import InputPanel from './InputPanel';
import './index.less'
import { type } from 'os';


@inject('tradingVarieties', 'powerCalc')
export default class Step3 extends Component {

  state = {
    isOpened: false,
    tradingVarieties: this.props.tradingVarieties,
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
    const { powerCalc } = this.state;
    const { type } = powerCalc;
    powerCalc[type].isMonthlyFill = isChecked;
    this.setState({
      powerCalc,
    })
  }


  handleClose = () => {
    this.setState({
      isOpened: false,
    })
  }

  handleItemSelected = (e, key) => {
    const { powerCalc } = this.state;
    powerCalc.type = key
    this.setState({
      powerCalc,
      isOpened: false
    })
  }

  updateAllData = () => {
    
    this.setState({})
  }

  render() {
    const { isOpened, powerCalc, tradingVarieties } = this.state;
    const { type, singleRegular, singleProtocol, RegularAndSurplus, protocolAndSurplus } = powerCalc;

    return (
      <View>
        <div className="power-purchase-calculation card">
          <AtList>
            <AtListItem title='交易品种' extraText={tradingVarieties[type]} arrow='right' onClick={this.triggerActionSheet} />
          </AtList>
          <AtCard
            className="partical"
            isFull
            extra={
              <AtSwitch
                key={Symbol()}
                ref={node => this.switch = node}
                className="no-padding"
                checked={deepExtract(powerCalc, `${type}.isMonthlyFill`)}
                onChange={this.toggleMonthlyCheck}
              >
              </AtSwitch>
            }
            title="分月度填写价格"
          >
              {/* 月份组件 */}
              {
                powerCalc[type].isMonthlyFill
                ? <View className="month-panel"><MonthButton data={powerCalc} updateData={this.updateAllData}/></View>
                : null
              }
              {/* 输入面板 */}
              <InputPanel data={powerCalc}  updateData={this.updateAllData}/>
          </AtCard>
          {/* 结果展示 */}
          <Card
            className="margin-top-10"
            isFull
            showBody
          >
            <View className='at-row at-row__justify--between'>
              <View className='at-col at-col-4'>
                <span>丰枯比：{deepExtract(powerCalc, `${type}.ratio`)}</span>
              </View>
              <View className='at-col at-col-6'>
                <span>购电均价：{deepExtract(powerCalc, `${type}.ratio`)}<span style={{float: 'right'}}>元/千瓦时</span></span>
              </View>
            </View>
          </Card>

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
