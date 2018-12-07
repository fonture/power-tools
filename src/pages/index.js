import Taro, { Component } from '@tarojs/taro'
import { View, Button, Form, Image } from '@tarojs/components'
import { AtModal, AtInput, AtModalContent, AtToast } from "taro-ui"
import reduxHelper from '../utils/reduxHelper'
import './index.less'
import request from '../utils/request';
import inject from '../utils/inject';
// @inject("baseMessage", "next")
@inject('firePrice')
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
    reduxHelper('firePrice', this.props.firePrice || data.thermalPrice || 0.4025);
    this.setState({
      firePrice: data.thermalPrice,
      loading: false,
    })
  }
  state = {
    activeNode: null,
    modelVis: false,
    showFirePrice: null,
    loading: true,
  }
  editions= [
    {
      title: '简单版',
      edition: 'simple',
      img: require('../assets/images/simple.png'),
    },
    {
      title: '高级版',
      edition: 'higher',
      img: require('../assets/images/higher.png'),
    }
  ]

  changeVersion = (edition) => {
    this.setState({
      activeNode: edition,
    }, () => {
      setTimeout(() => {
        reduxHelper('version', edition)
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
    const subValue = e.detail.value.value;
    if(subValue > 0) {
      reduxHelper('firePrice', Number(e.detail.value.value));
    }
    this.handleClose();
  }
  handleClose = ()=>{
    this.setState({
      modelVis: false,
      showFirePrice: null,
    })
  }
  handleChange = (e)=> {
    let re = e.replace(/[^\d\.]/ig,"").replace(/\.{2,}/g,".").replace(".","$#$").replace(/\./g,"").replace("$#$",".");
    if(re.indexOf(".")< 0 && re !=""){  
      re= parseFloat(re);
     }
    this.setState({
      showFirePrice: re,
    })
  }
  showModel = () => {
    this.setState({
      modelVis: true,
    })
  }

  render() {
    const { activeNode, modelVis, firePrice = 0.4025, showFirePrice,loading } = this.state;
    const {firePrice: setFirePrice} = this.props;
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
            src={require('../assets/images/fire.png')}
            className='frieImage'
            onClick={this.showModel}
          />
          <AtModal
            isOpened={modelVis}
            onClose={this.handleClose}
            onCancel={this.handleClose}
            // onConfirm={this.handleClose}
            className='formContent'
          >
            <AtModalContent>
              <Form
                onSubmit={this.handleSubmit}
                className='formBoder'
              >
                <View className='inputTitle'>火电价格</View>
                <AtInput
                  name='value'
                  // title='火电价格'
                  value={showFirePrice}
                  type='digit'
                  onChange={this.handleChange}
                  placeholder={setFirePrice !== firePrice ? `${setFirePrice}元/千瓦时`:`默认${firePrice}元/千瓦时`}
                />
                <Button formType='submit' className='sumitButton' >确定</Button>
              </Form>
            </AtModalContent>
          </AtModal>
          <AtModal
            isOpened={loading}
            closeOnClickOverlay='false'
            className='loadingNode'
          >
            <Image src={require('../assets/loading.gif')} />
          </AtModal>
        </View>
      </View>
    )
  }
}

