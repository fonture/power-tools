# 购电小工具

## 技术栈

- Taro + Taro-UI

## 开始使用

### 微信小程序

选择微信小程序模式，需要自行下载并打开[微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，然后选择项目根目录进行预览。

微信小程序编译预览及打包（去掉 --watch 经不会监听文件修改，并会对代码进行压缩打包）

```bash
# npm script
$ npm run dev:weapp
$ npm run build:weapp
# 仅限全局安装
$ taro build --type weapp --watch
$ taro build --type weapp
# npx 用户也可以使用
$ npx taro build --type weapp --watch
$ npx taro build --type weapp
```

### 百度小程序

选择百度小程序模式，需要自行下载并打开[百度开发者工具](https://smartprogram.baidu.com/docs/develop/devtools/show_sur/)，然后在项目编译完后选择项目根目录下 `dist` 目录进行预览。

百度小程序编译预览及打包（去掉 --watch 经不会监听文件修改，并会对代码进行压缩打包）

```bash
# npm script
$ npm run dev:swan
$ npm run build:swan
# 仅限全局安装
$ taro build --type swan --watch
$ taro build --type swan
# npx 用户也可以使用
$ npx taro build --type swan --watch
$ npx taro build --type swan
```

### 支付宝小程序

选择支付宝小程序模式，需要自行下载并打开[支付宝小程序开发者工具](https://docs.alipay.com/mini/developer/getting-started/)，然后在项目编译完后选择项目根目录下 `dist` 目录进行预览。

支付宝小程序编译预览及打包（去掉 --watch 经不会监听文件修改，并会对代码进行压缩打包）

```bash
# npm script
$ npm run dev:alipay
$ npm run build:alipay
# 仅限全局安装
$ taro build --type alipay --watch
$ taro build --type alipay
# npx 用户也可以使用
$ npx taro build --type alipay --watch
$ npx taro build --type alipay
```

### H5

H5 模式，无需特定的开发者工具，在执行完下述命令之后即可通过浏览器进行预览

H5 预览项目

```bash
# npm script
$ npm run dev:h5
# 仅限全局安装
$ taro build --type h5 --watch
# npx 用户也可以使用
$ npx taro build --type h5 --watch
```

H5 打包项目

```bash
# npm script
$ npm run build:h5
# 仅限全局安装
$ taro build --type h5
# npx 用户也可以使用
$ npx taro build --type h5
```

### React Native

React Native 端运行需执行如下命令，React Native 端相关的运行说明请参见 [React Native 教程](https://nervjs.github.io/taro/docs/react-native.html)

```bash
# npm script
$ npm run dev:rn
# 仅限全局安装
$ taro build --type rn --watch
# npx 用户也可以使用
$ npx taro build --type rn --watch
```

## 学习资源

[awesome-taro](https://github.com/NervJS/awesome-taro)