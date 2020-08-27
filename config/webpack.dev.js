const { merge } = require('webpack-merge')
const config = require('./webpack.base')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const path = require('path')
const webpack = require('webpack')

const resolve = src => path.join(process.cwd(), src)
process.env.NODE_ENV = 'development'


const cssRules = [
  {
    test: /\.css$/,
    use: [
      'vue-style-loader',
      {
        loader: 'css-loader',
        options: {
          esModule: false
        }
      },
      'postcss-loader'
    ]
  },
  {
    test: /\.scss$/,
    // MiniCssExtractPlugin 应该只使用在production环境，这便于开发环境使用热加载
    // MiniCssExtractPlugin 之后只能跟css-loader，不能是别的loader
    use: [
      'vue-style-loader',
      // css-loader在v4版本之后，esModule默认为false，导致vue-style-loader无法正常工作，https://github.com/vuejs/vue-style-loader/issues/46
      {
        loader: 'css-loader',
        options: {
          esModule: false
        }
      },
      'postcss-loader',
      'sass-loader'
    ]
  }
]


module.exports = merge(config, {
  mode: 'development',
  // 在development环境中，只能使用hash，不能使用chunkhash或者contenthash
  output: {
    filename: 'js/[name].[hash].js',
    path: resolve('dist'),
    // 结合webpack的魔法注释，自定义打包后的文件名称 /* webpackChunkName: "About"*/
    chunkFilename: 'js/[name].[hash].js'
  },
  devtool: '#@cheap-source-map',
  // 使用devsServer时webpack 监听模式时默认开启的watch:true， 默认情况下是false
  devServer: {
    contentBase: resolve('dist'),
    compress: true,
    hot: true
  },
  module: {
    rules: cssRules
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
})