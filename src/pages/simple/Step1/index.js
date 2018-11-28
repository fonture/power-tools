import Taro, { Component } from '@tarojs/taro'
import { View, Picker, Text } from '@tarojs/components'
import { AtList, AtListItem, AtActionSheet, AtActionSheetItem, AtIcon } from 'taro-ui';
import reduxHelper from '../../../utils/reduxHelper';

import './index.less'
import request from '../../../utils/request';
import inject from '../../../utils/inject';

@inject('baseMessage')
export default class Step1 extends Component {

    state = {
        address: '请选择地区',
        // sort: '请选择用电分类',
        sort: null,
        mart: '请选择是否参与市场',
        clickList: null,
        sheetShow: false,
        sorts: [[], []],
    }
    async componentDidMount() {
        this.props.onDidMount(this._rendered.dom);
        const { data } = await request({
            method: 'get',
            url: '/wechat/kit/ele/category',
        });
        this.resorts = data;
        this.initPicker();
    }
    componentWillUnmount() {
        const { address, mart, sort } = this.state;
        let adsWord = '';
        if (address !== '请选择地区') {
            adsWord = address === '四川地区' ? 'sichuan' : 'chongqing';
        }
        let sortValue = sort;
        if (sort !== null) {
            const fistItem = this.resorts.find(item => item.categoryName === sort[0]);
            sortValue = [fistItem['categoryIdentify'], fistItem.voltageLevelVOList.find(item => item.voltageName === sort[1])['voltageIdentify']]
        }

        reduxHelper('baseMessage', { address, adsWord, sort: sortValue, sortValue: sort, mart })
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
        const listArr1 = objKeys.map(item => objArr[item]['categoryName'])
        const list2Obj = objArr[key]['voltageLevelVOList'];
        const list2Keys = Object.keys(list2Obj);
        const listArr2 = list2Keys.map(item => list2Obj[item]['voltageName'])
        return [listArr1, listArr2];
    }

    handleClickList = (e) => {
        this.setState({
            clickList: e,
            sheetShow: true,
        })
    }

    handleClickSheetItem = (value) => {
        const { clickList, address, sort } = this.state;
        if (clickList === 'mart') {
            reduxHelper('stepInfo', { current: 0, items: value === '参与' ? ['基础信息', '购电成本', '目录电价'] : ['基础信息', '用电成本', '购电计算'] })
            reduxHelper('baseMessage', { address, sort, mart: value })
        }
        this.setState({
            [clickList]: value,
            sheetShow: false,
        })
    }

    initPicker = () => {
        const { address = '请选择地区', sortValue = null, mart = '请选择是否参与市场' } = this.props.baseMessage;
        this.setState({
            sorts: this.formatArr(0),
            address,
            sort: sortValue,
            mart,
        })
    }

    pickerColumnChange = (e) => {
        console.log(e.detail);
        const { column, value } = e.detail;
        if (column === 0) {
            this.setState({
                sorts: this.formatArr(value)
            })
        }
    }
    pickerChange = (e) => {
        const { value } = e.detail;
        const { resorts } = this;
        this.setState({
            sort: [resorts[value[0]]['categoryName'], resorts[value[0]]['voltageLevelVOList'][value[1]]['voltageName']]
        })
    }

    render() {
        const addressList = ['四川地区', '重庆地区'];
        const marts = ['参与', '未参与'];
        const { address, sort, mart, clickList, sheetShow, sorts } = this.state;
        const renderSheet = () => {
            const wellList = {
                "address": addressList,
                // "sort": sorts,
                "mart": marts,
            }[clickList] || [];
            const sheetTitle = {
                "address": '请选择地区',
                // "sort": sorts,
                "mart": '请选择是否参与市场',
            }[clickList] || [];
            return (
                <AtActionSheet isOpened={sheetShow} className='pickerSheet' title={sheetTitle}>
                    {wellList.map(item =>
                        <AtActionSheetItem key={item} onClick={this.handleClickSheetItem.bind(this, item)}>
                            {item}
                        </AtActionSheetItem>
                    )}
                </AtActionSheet>
            )
        }
        const renderSort = () => {
            if (sort) {
                // return sort;
                // 模拟list
                return <View className='at-list__item'>
                    <View className='at-list__item-container'>
                        <View className='at-list__item-content item-content'>
                            <View className='item-content__info'>
                                <View className='item-content__info-title'>
                                    用电分类
                                </View>
                            </View>
                        </View>
                        <View className='at-list__item-extra item-extra'>
                            <View className='item-extra__info'>
                                <Text
                                    style={{
                                        display: 'block',
                                        fontSize: '16px',
                                        lineHeight: '1',
                                    }}
                                >{sort[0]}</Text>
                                <Text
                                    style={{
                                        display: 'block',
                                        fontSize: '14px',
                                        lineHeight: '1',
                                    }}
                                >{sort[1]}</Text>
                            </View>
                            <View className='item-extra__icon'>
                                <AtIcon size='24' value='chevron-right' color='rgb(199, 199, 204)' />
                            </View>
                        </View>
                    </View>
                </View>
            } else {
                return <AtListItem title='用电分类' arrow='right' extraText='请选择用电分类' />
            }
        }
        return (
            <View>
                <View className="card">
                    <AtList>
                        <AtListItem title='地区' arrow='right' extraText={address} onClick={this.handleClickList.bind(this, 'address')} />
                        {/* <AtListItem title='用电分类' arrow='right' extraText={sort} onClick={this.handleClickList.bind(this,'sort')} /> */}
                        <Picker
                            mode='multiSelector'
                            range={sorts}
                            onChange={this.pickerChange}
                            onColumnchange={this.pickerColumnChange}
                        >
                            {renderSort()}
                        </Picker>
                        <AtListItem title='是否参与市场' arrow='right' extraText={mart} onClick={this.handleClickList.bind(this, 'mart')} />
                    </AtList>
                    {renderSheet()}
                </View>
            </View>
        )
    }
}