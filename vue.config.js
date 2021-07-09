const path = require('path') // 引入path模块
function resolve(dir) {
  return path.join(__dirname, dir)
}
const CompressionPlugin = require('compression-webpack-plugin')

module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '././' : '',
  chainWebpack: config => {
    config.module
      .rule('js')
      .include
      .add('/packages/')
      .end()
      .use('babel')
      .loader('babel-loader')
      .tap(options => {
        return options
      })
  },
  configureWebpack: (config) => {
		// 开发环境不需要gzip
		if (process.env.NODE_ENV === "production") {
      return {
        plugins: [new CompressionPlugin({
          test: /\.js$|\.html$|\.css/, // 匹配文件名
          threshold: 10240, // 对超过10K的进行压缩
          deleteOriginalAssets: false, // 是否删除原文件
        })]
      }
    }
	},
  productionSourceMap: false,
  css: {
    extract: false
  }
}