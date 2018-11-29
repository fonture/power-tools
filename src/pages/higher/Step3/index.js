import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { AtCard, AtList, AtListItem, AtActionSheet, AtActionSheetItem } from "taro-ui"
import inject from '../../../utils/inject';
import './index.less'

const tradingVariety = [
  {
    name: '单一常规',
    value: 1,
  },
  {
    name: '单一长协',
    value: 2,
  },
  {
    name: '常规+富余电量',
    value: 3,
  },
  {
    name: '长协+富余电量',
    value: 4,
  }
]


// @inject('tradingVariety')
export default class Step3 extends Component {

  state = {
    isOpened: false,
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

  handleItemSelected = (e, value) => {
    console.log(e, value);
  }

  render() {
    const { isOpened } = this.state;

    return (
      <View>

        <div className='card'>
          <AtList>
            <AtListItem title='交易品种' extraText={'xxx'} arrow='right' onClick={this.triggerActionSheet} />
          </AtList>

          <AtActionSheet isOpened={isOpened}>
            {
              tradingVariety.map(({name, value}) => (
                <AtActionSheetItem onClick={(e)=>this.handleItemSelected(e, value)}>
                  {name}
                </AtActionSheetItem>
              ))
            }
          </AtActionSheet>

        </div>

      </View >

    )
  }
}
