module.exports = {
  baseUrl: '',
  env: {
    NODE_ENV: '"development"'
  },
  defineConstants: {
  },
  weapp: {},
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    devServer: {
      proxy: {
        '/wechat': {
          target: 'http://172.16.11.28:6010/',
          changeOrigin: true,
          secure: false,
        },
      }
    },
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        }
      }
    }
  },
  noConsole: false
}
