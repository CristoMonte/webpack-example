const { merge } = require('webpack-merge')
const config = require('./webpack.base')
const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const resolve = src => path.join(process.cwd(), src)
const cssRules = [
  {
    test: /\.css$/,
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader'
    ]
  },
  {
    test: /\.scss$/,
    // MiniCssExtractPlugin 应该只使用在production环境，这便于开发环境使用热加载
    // MiniCssExtractPlugin 之后只能跟css-loader，不能是别的loader
    use: [
      MiniCssExtractPlugin.loader,
      'css-loader',
      'postcss-loader',
      'sass-loader'
    ]
  }
]

module.exports = merge(config, {
  // mode为production时会开启一些默认配置，例如一些优化配置optimization
  /*optimization: {
  *   // development为false,production为true
  *   minimize: true,
  *   minimizer: [new TerserPlugin()]
  * }
  */
 // 所以production环境不需要再额外开启压缩优化
  mode: 'production',
  // 在production环境中，可以使用chunkhash/contenthash
  output: {
    filename: 'js/[name].[contenthash:8].js',
    path: resolve('dist'),
    // 结合webpack的魔法注释，自定义打包后的文件名称 /* webpackChunkName: "About"*/
    chunkFilename: 'js/[name].[contenthash:8].js'
  },
  module: {
    rules: cssRules
  },
  optimization: {
    splitChunks: {
      // minSize的默认值是20000bytes,差不多是20Kb的样子，所以如果包的体积比较小，是不会被切割的
      // 所以如果希望这个界限值更小的话，需要主动设置minSize
      minSize: 2000,
      maxSize: 0,
      cacheGroups: {
        vendors: {
          name: 'chunk-vender',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial'
        },
        common: {
          filename: '[name].common.js',
          minChunks: 2,
          priority: -20,
          chunks: 'initial'
        }
      }
    }
  }
})