import Taro, { Component } from '@tarojs/taro'
import { View, Image } from '@tarojs/components'
import { AtModal, AtButton, AtForm, AtInput, AtModalContent } from "taro-ui"
import reduxHelper from '../utils/reduxHelper'
import './index.less'
import request from '../utils/request';

export default class Index extends Component {

  config = {
    navigationBarTitleText: '首页'
  }
  async componentDidMount(){
    // 请求火电价格
    const {data} = await request({
      method: 'get',
      url: '/wechat/kit/thermal/price',
    });
    debugger
    reduxHelper('firePrice', data.thermalPrice||0.4025);
    this.setState({
      firePrice: data.thermalPrice,
    })
  }
  state = {
    activeNode: null,
    modelVis: false,
  }
  editions= [
    {
      title: '简单版',
      edition: 'simple',
      img: require('../assets/simple.png'),
    },
    {
      title: '高级版',
      edition: 'higher',
      img: require('../assets/higher.png'),
    }
  ]

  changeVersion = (edition) => {
    this.setState({
      activeNode: edition,
    }, () => {
      setTimeout(() => {
        reduxHelper('version', { value: edition })
        Taro.redirectTo({ url: `pages/${edition}/index` })
        // 为显示loading 设置了延迟跳转。
      }, 1000);
    })
  }
  setClassName = (edition) =>{
    const { activeNode } = this.state;
    let className = '';
    if(activeNode === null) {
      className = ''
    } else {
      if(activeNode === edition){
        className = 'acHide'
      } else {
        className = 'acShow'
      }
    }
    return className;
  }
  handleSubmit = (e)=> {
    //  注意，只是点击按钮，有可能会触发不了表单提交
    //  且，小程序有可能无法通过 e.detail.value 获取值，需要设置sate取值，taro和taro ui的 bug
    reduxHelper('firePrice', e.detail.value)
    this.handleClose();
  }
  handleClose = ()=>{
    this.setState({
      modelVis: false,
    })
  }
  showModel = () => {
    this.setState({
      modelVis: true,
    })
  }

  render() {
    const { activeNode, modelVis, firePrice = 0.4025 } = this.state;
    return (
      <View className='page indexPage'>
        <View className='index'>
          {
            this.editions.map(item =>
            <View
              key={item.edition}
              onClick={this.changeVersion.bind(this,item.edition)}
              className={`BoxAvatar ${item.edition} ${activeNode === null ? '' : item.edition === activeNode ? 'acShow' : 'acHide'}`}
            >
              <Image
                src={item.img}
                mode='aspectFill'
                className='indexAtAvatar'
              />
            </View>
            )
          }
          <Image
            src={require('../assets/fire.png')}
            className='frieImage'
            onClick={this.showModel}
          />
          <AtModal
            isOpened={modelVis}
            onClose={this.handleClose}
            onCancel={this.handleClose}
            onConfirm={this.handleClose}
            className='formContent'
          >
            <AtModalContent>
              <AtForm
                onSubmit={this.handleSubmit}
                className='formBoder'
              >
                <AtInput
                  name='value'
                  title='火电价格'
                  type='number'
                  placeholder={`默认火电价格${firePrice}`}
                />
                <AtButton formType='submit' width='100px' className='sumitButton'>确定</AtButton>
              </AtForm>
            </AtModalContent>
          </AtModal>
        </View>
      </View>
    )
  }
}

