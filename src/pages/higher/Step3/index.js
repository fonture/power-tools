import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtSwitch, AtList, AtListItem, AtActionSheet, AtActionSheetItem, AtInput } from "taro-ui"
import classNames from 'classnames';
import { compact } from 'lodash/array';
import inject from '../../../utils/inject';
import { deepExtract } from '../../../utils';
import MonthButton from '../MonthPlugin/monthButton';
import reduxHelper from '../../../utils/reduxHelper';
import Card from '../../../components/Card';
import InputPanel from './InputPanel';
import './index.less'
import { extractDryAndHighData, computeAvPrcieByMonthOfHigh, gethighDryProportion, computeAvPrcieByMonthAllWaterOfHigh, computeAvPrcieByYearOfHigh, computeAvPrcieByYearAllWaterOfHigh } from '../../../utils/formula';

@inject('tradingVarieties', 'powerCalc' , 'catalogueprice', 'transmissionprice', 'firePrice', 'powerCostsOfHigh' )
export default class Step3 extends Component {

  state = {
    isOpened: false,
    tradingVarieties: this.props.tradingVarieties,
    powerCalc: this.props.powerCalc,
    firePrice: this.props.firePrice,
    collectionFund: [
      this.props.catalogueprice.newestCataloguePrice.collectionFund,
      Object.keys(this.props.catalogueprice.yearCataloguePriceMap).map(item => this.props.catalogueprice.yearCataloguePriceMap[item].collectionFund)
    ],
    transmissionPrice: [
      // 年度输配电价
      this.props.transmissionprice.newestTransmissionPrice.price,
      // 年度富余输配电价
      this.props.transmissionprice.newestSurplusTransmissionPrice.price,
      // 月度输配电价
      Object.keys(this.props.transmissionprice.yearTransmissionPriceMap).map(item => this.props.transmissionprice.yearTransmissionPriceMap[item].price),
      // 月度富余输配电价
      Object.keys(this.props.transmissionprice.yearSurplusTransmissionPriceMap).map(item => this.props.transmissionprice.yearSurplusTransmissionPriceMap[item].price)
    ]
  }
  componentDidMount() {
    const { yearPower } = this.props.powerCostsOfHigh;
    reduxHelper('next', true)
    this.props.onDidMount(this._rendered.dom);
    if(yearPower) {
      const keys = Object.keys(this.props.tradingVarieties)
      keys.forEach( key => this.props.powerCalc[key].yearlyData.powerVolume.value = yearPower)
      reduxHelper('powerCalc', this.props.powerCalc)
    }

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
    this.updateAllData();
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
    const { firePrice, transmissionPrice, collectionFund } = this.state;
    const { powerCalc, powerCalc: { type } } = this.state;
    const seletedData = powerCalc[type];
    let average;

    if(seletedData.isMonthlyFill) {
      const data = extractDryAndHighData(powerCalc[type]['monthlyPower'])
      const ratio = gethighDryProportion(data)
      powerCalc[type].ratio = ratio;
    }


    if(seletedData.isMonthlyFill) {
      const monthlyPower = seletedData['monthlyPower']['data'].map(item => item.data)
      if(!seletedData.isMonthlyParticipate) {
        average = computeAvPrcieByMonthOfHigh(firePrice, [transmissionPrice[2], transmissionPrice[3]], collectionFund[1], monthlyPower)
      } else {
        average = computeAvPrcieByMonthAllWaterOfHigh([transmissionPrice[2], transmissionPrice[3]], collectionFund[1], monthlyPower )
      }
    } else {
      const [ waterPrice, yearPower, surplusaPowerList = [], surplusaPrice ]
        = [
          deepExtract(powerCalc, `${type}.yearlyData.hydropowerPrice.value`),
          deepExtract(powerCalc, `${type}.yearlyData.powerVolume.value`),
          compact((deepExtract(powerCalc, `${type}.surplus.data`) || []).map((data) => data.powerVolume )),
          deepExtract(powerCalc, `${type}.yearlyData.surplusPowerPrice.value`)
        ]
      if(!seletedData.isYearlyParticipate) {
        average = computeAvPrcieByYearOfHigh(waterPrice, firePrice, [transmissionPrice[0], transmissionPrice[1]], collectionFund[0], yearPower, surplusaPowerList, surplusaPrice)
      } else {
        average = computeAvPrcieByYearAllWaterOfHigh(waterPrice, [transmissionPrice[0], transmissionPrice[1]], collectionFund[0], yearPower, surplusaPowerList, surplusaPrice)
      }
    }
    powerCalc[type].average = average

    this.setState({})
  }

  render() {
    const { isOpened, powerCalc, tradingVarieties } = this.state;
    const { type } = powerCalc;

    const className = classNames(
      'at-col',
      'at-col-3',
      {
        'hidden': !powerCalc[type].isMonthlyFill,
      }
    );

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
              <View className={className}>
                <span>丰枯比：{deepExtract(powerCalc, `${type}.ratio`)}</span>
              </View>
              <View className='at-col at-col-8'>
                <View className='at-row at-row--wrap at-row__justify--between'>
                  <View className='at-col-3 at-col--auto'>购电均价：</View>
                  <View className='at-col-4 at-col--auto'>{deepExtract(powerCalc , `${type}.average`)}</View>
                  <View className='at-col-3 at-col--auto'>元/千瓦时</View>
                </View>
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
