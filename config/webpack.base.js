const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const rimraf = require('rimraf')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const webpack = require('webpack')

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
                  name(resourcePath, resourceQuery) {
                     // `resourcePath` - `/absolute/path/to/file.js`
                     // `resourceQuery` - `?foo=bar`
                     // 为什么如果不设定的话，默认的值会是development，而不是undefined
                    if (process.env.NODE_ENV === 'development') {
                      return 'img/[name].[ext]'
                    } else {
                      return 'img/[name].[contenthash:8].[ext]'
                    }
                  },
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