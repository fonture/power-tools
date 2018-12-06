import taro, { Component } from "@tarojs/taro";
import { View } from "@tarojs/components";

const parent = {
  position: 'relative',
  height: '100%'
}

const child = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  fontSize: '28px'
}

export default class ErrorPage extends Component {

  redirect = () => {
    taro.redirectTo({ url: 'pages/index' });
  }

  render() {

    return (
      <View style={parent} onClick={this.redirect}>
        <div style={child}>
          加载失败了，点击重新加载
        </div>
      </View>
    )
  }
}
