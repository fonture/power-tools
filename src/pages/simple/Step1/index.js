import Taro, { Component } from '@tarojs/taro'
import { View, Picker } from '@tarojs/components'
import { AtList, AtListItem, AtActionSheet, AtActionSheetItem  } from 'taro-ui';
import reduxHelper from '../../../utils/reduxHelper';


// import './index.less'


export default class Step1 extends Component {

    state = {
        address: '请选择地区',
        // sort: '请选择用电分类',
        sort: null,
        mart: '请选择是否参与市场',
        clickList: null,
        sheetShow: false,
        sorts: [[],[]],
    }
    componentDidMount() {
        this.props.onDidMount(this._rendered.dom);
        this.initPicker();
    }
    componentWillUnmount(){
        const { address, sort, mart } = this.state;
        reduxHelper('baseMessage', {address, sort, mart})
    }
    resorts = [
        {
          "categoryIdentify": "b",
          "categoryName": "大工业用电",
          "voltageLevelVOList": [
            {
              "voltageIdentify": "b",
              "voltageName": "1-10kV"
            },
            {
              "voltageIdentify": "c",
              "voltageName": "35-110kV以下"
            },
            {
              "voltageIdentify": "d",
              "voltageName": "110kV"
            },
            {
              "voltageIdentify": "e",
              "voltageName": "220kV及以上"
            }
          ]
        },
        {
          "categoryIdentify": "a",
          "categoryName": "一般工商业用电",
          "voltageLevelVOList": [
            {
              "voltageIdentify": "a",
              "voltageName": "1kV以下"
            },
            {
              "voltageIdentify": "b",
              "voltageName": "1-10kV"
            },
            {
              "voltageIdentify": "c",
              "voltageName": "35-110kV以下"
            }
          ]
        }
      ]
    
    formatArr = (key) => {
        const objArr = this.resorts;
        const objKeys = Object.keys(objArr);
        const listArr1 = objKeys.map(item=>objArr[item]['categoryName'])
        const list2Obj = objArr[key]['voltageLevelVOList'];
        const list2Keys = Object.keys(list2Obj);
        const listArr2 = list2Keys.map(item=>list2Obj[item]['voltageName'])
        return [listArr1, listArr2];
    }

    handleClickList = (e)=>{
        this.setState({
            clickList: e,
            sheetShow: true,
        })
    }

    handleClickSheetItem = (value)=>{
        const { clickList } = this.state;
        this.setState({
            [clickList]: value,
            sheetShow: false,
        })
    }
    
    initPicker = () => {
        this.setState({
            sorts: this.formatArr(0),
        })
    }

    pickerColumnChange = (e) => {
        console.log(e.detail);
        const { column, value } = e.detail;
        if(column === 0) {
            this.setState({
                sorts: this.formatArr(value)
            })
        }
    }
    pickerChange = (e) => {
        const {value} = e.detail;
        const { resorts } = this;
        this.setState({
            sort: [resorts[value[0]]['categoryName'],resorts[value[0]]['voltageLevelVOList'][value[1]]['voltageName']]
        })
    }
    
    render() {
        const addressList = ['四川','重庆'];
        const marts = ['参与', '未参与'];
        const { address, sort, mart, clickList, sheetShow, sorts } = this.state;
        const renderSheet = () =>{
            const wellList = {
                "address": addressList,
                // "sort": sorts,
                "mart": marts,
            }[clickList] || [];
            return (
                <AtActionSheet isOpened={sheetShow}>
                    {wellList.map(item=>
                        <AtActionSheetItem key={item} onClick={this.handleClickSheetItem.bind(this,item)}>
                            {item}
                        </AtActionSheetItem>
                    )}
                </AtActionSheet>
            )
        }
        const renderSort =()=> {
            if(sort){
                // return sort;
                return <AtListItem
                  title='用电分类'
                  arrow='right'
                  className='pickerList'
                  extraText={sort}
                />
            } else {
                return <AtListItem title='用电分类' arrow='right' extraText='请选择用电分类' />
            }
        }
        return (
        <View>
            <AtList>
                <AtListItem title='地区' arrow='right' extraText={address} onClick={this.handleClickList.bind(this,'address')} />
                {/* <AtListItem title='用电分类' arrow='right' extraText={sort} onClick={this.handleClickList.bind(this,'sort')} /> */}
                <Picker
                  mode='multiSelector'
                  range={sorts}
                  onChange={this.pickerChange}
                  onColumnchange={this.pickerColumnChange}
                >
                    {renderSort()}
                </Picker>
                <AtListItem title='是否参与市场' arrow='right' extraText={mart} onClick={this.handleClickList.bind(this,'mart')} />
            </AtList>
            {renderSheet()}
        </View>
        )
    }
}