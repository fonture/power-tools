const config = {
  // 修改配置文件需要重启。
  // 如果重启出现 端口占用情况，可以先查下进程号然后kill掉，不建议修改 devServer的端口号，以免影响到别人。
  projectName: 'power-tools',
  date: '2018-11-14',
  designWidth: 750,
  deviceRatio: {
    '640': 2.34 / 2,
    '750': 1,
    '828': 1.81 / 2
  },
  sourceRoot: 'src',
  outputRoot: 'dist',
  // baseUrl: 'http://172.16.11.28:6010',
  baseUrl: '',
  plugins: {
    babel: {
      sourceMap: true,
      presets: [
        'env'
      ],
      plugins: [
        'transform-class-properties',
        'transform-decorators-legacy',
        'transform-object-rest-spread'
      ]
    }
  },
  defineConstants: {
  },
  copy: {
     patterns: [
    ],
    options: {
    }
  },
  weapp: {
    module: {
      postcss: {
        autoprefixer: {
          enable: true
        },
        url: {
          enable: true,
          limit: 10240
        }
      }
    }
  },
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
  }
}

module.exports = function (merge) {
  if (process.env.NODE_ENV === 'development') {
    return merge({}, config, require('./dev'))
  }
  return merge({}, config, require('./prod'))
}
