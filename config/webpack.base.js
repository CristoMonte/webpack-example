const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const rimraf = require('rimraf')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const resolve = src => path.join(process.cwd(), src)

rimraf.sync(resolve('dist'))

module.exports = {
  entry: {
    app: resolve('src/main.js')
  },

  resolve: {
    alias: {
      vue$: 'vue/dist/vue.runtime.esm.js'
    },
    extensions: [
      '.js',
      '.vue',
      '.json'
    ]
  },

  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: resolve('node_modules')
      },
      {
        test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              fallback: {
                loader: 'file-loader',
                options: {
                  // 图片超过url-loader limit约定的大小时，默认会使用file-loader处理，不过文件名以及其他自定义处理还是需要自己手动处理
                  // name只能使用hash，不能使用chunkhash
                  name: 'img/[name].[hash:8].[ext]',
                  // file-loader5.0.0版本后，esModule默认值设置为true，所以需要关闭的话，需要手动更改到false,启用CommonJS规范
                  esModule: false
                }
              }
            }
          }
        ]
      },
      {
        test: /\.(woff2?|eot|ttf|otf)((\?.*)?$)/i,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024,
              fallback: {
                loader: 'file-loader',
                options: {
                  name: 'img/[name].[hash:8].[ext]',
                  esModule: false
                }
              }
            }
          }
        ]
      }
    ]
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: resolve('public/index.html')
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[chunkhash:8].css'
    })
  ]
}