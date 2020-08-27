# 从零配置webapck4+vue
  webpack一直是个人的一道坎，尽管很想跨过去，但是无奈网上的入门资料对于小白都不是特别的友好，总是在简单和复杂两个极端游走，索性自己慢慢摸索着前进吧。


## 阅读前
  本文属于小白入门系列，不涉及任何深入的知识，如果你对webpack的基本配置非常熟悉，请不要浪费自己的时间；

## 创建项目
- `npm init -y` 
  在一个空文件夹下，使用上面的命令生成package.json文件；

- `npm install -S webpack webpack-cli` 安装webpack

  ```
    +-- node_modules
    +-- webpack.config.js
    +-- src
      +-- main.js
    +-- package.json
    +-- package-lock.json
  ```

- 在`package.json`中声明如下属性
  ```json
  "build": "webpack --config ./config/webpack.config.js",
  ```
  webpack命令即`webpack.run`，`--config`代表指定执行`webpack.run`的配置。

- 在webpack.config.js中声明webpack配置
  ```js
  // webpack.config.js
  module.exports = {
    entry: {
      app: resolve('src/main.js')
    },
    output: {
      filename: 'js/[name].[hash].js',
      // filename: 'js/[name].[contenthash].js',
      path: resolve('dist')
    }
  }
  ```
  webpack从entry入口开始解析，找到所有的依赖，再找到所有模块依赖的模块，形成依赖图谱。
  此时执行`npm run build`命令之后会发现，目录下多了一个dist目录
  ```js
      +-- dist
        +-- js
          +-- app.880a8659.js
  ```
- 加入html文件
  ```
    +-- node_modules
    +-- webpack.config.js
    +-- public
      +-- index.html
    +-- src
      +-- main.js
    +-- package.json
    +-- package-lock.json
  ```
  在`index.htmt`引入打包之后的js文件，但是我们打包的文件名带有hash，我们无法自主引入，所以需要`html-webpack-plugin`这个插件的帮助，这个插件会帮你生成一个HTML5文件，里面会引入webpack打包构建的chunk。
  ```js
    const HtmlWebpackPlugin = require('html-webpack-plugin')
    module.exports = {
      ...
      plugins: [
        new HtmlWebpackPlugin({
          filename: 'index.html',
          template: resolve('public/index.html')
        })
      ]
    }
  ```

## 安装vue
- `npm install -S vue`, 此时目录结构如下
```js
    +-- node_modules
    +-- webpack.config.js
    +--public
      +-- index.html
    +-- src
      +-- App.vue
      +-- main.js
    +-- package.json
    +-- package-lock.json
```
webpack只能处理js和json文件，所以，vue文件需要使用专门的loader来处理。loader可以将文件从不同的语言转换为webpack能处理的语言。

- `npm install vue-loader vue-template-compiler -D`安装`vue-loader`，处理vue文件
  `vue-loader`和`vue-template-compiler`都要安装，[vue-template-compiler的版本应该和vue的版本是一致的](https://vue-loader.vuejs.org/zh/guide/#%E6%89%8B%E5%8A%A8%E8%AE%BE%E7%BD%AE)

  `vue-loader`可以解析`.vue`文件，分别提取出template,script,style三个部分的代码交给对应的loader处理。
  ```js
  // webpack.base.config.js
    const VueLoaderPlugin = require('vue-loader/lib/plugin')
    module.exports = {
      ...
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          }
        ]
      },
      plugin:[
        // 一定要引入这个插件
        new VueLoaderPlugin()
      ]
    }
  ```

## 处理css

- `.vue`文件中的style部分也需要使用`css-loader`来特殊处理，使用特殊语言的css需要相对应的loader处理，例如，使用sass需要用`sass-loader`处理
  `npm i css-loader node-sass sass-loader postcss-loader`
  
  ```js
  // webpack.base.config.js

    module.exports = {
      ...
      module: {
        rules: [
          {
            test: /\.vue$/,
            loader: 'vue-loader'
          },
          {
            test: /\.css$/,
            loader: [
              'vue-style-loader',
              {
                loader: 'css-loader',
                options: {
                  esModule: false
                }
              },
              'postcss-loaer'
            ]
          },
          {
            test: /\.scss$/,
            loader: [
              'vue-style-loader',
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
      }
    }
  ```
    - `vue-style-loader`和`style-loader`类似。
    - `css-loader`在v4版本之后`esModule`默认为true，导致`vue-style-loader`无法正常工作。
    - loader是从下往上/从右往走左地取值执行的。例如在处理sass文件时，先用`sass-loader`，然后依次经过`postcss-loader`, `css-loader`, `vue-style-loader`的处理。
    - [postcss](https://postcss.org/)是一个css预处理器，可以自动添加css前缀，使用下一代css语法等功能，是处理css必备的一个工具。
    - 使用`postcss`的`autofixser`时，需要配置`postcss.config.js`文件和`browserlist`属性。
    - 使用`autoprefixer`时一定要声明`browserlist`属性，否则无法自动添加前缀。
    ```js
      // postcss.config.js
      module.exports = {
        plugins: [
          require('autoprefixer')
        ]
      }
      // 可以在package.json中声明browserlist字段，也可以声明.browserlistrc文件
      > 1%
      last 2 versions
      not ie <= 8
      iOS >= 6
      Android > 4.1
      Firefox > 20

    ```

## 抽离css
配置到这里，打包之后你会发现，css虽然生效了，但是并没有发现css文件，因为，css被合并到了对应的js文件中，想要单独抽离css需要使用`mini-css-extract-plugin`
- 安装`npm install mini-css-extract-plugin -D`
  ```js
  // webpack.base.config.js
    const MiniCssExtractPlugin = require('mini-css-extract-plugin')
    module.exports = {
      ...
      module: {
        rules: [
          ...
          {
            test: /\.scss$/,
            loader: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
              'sass-loader'
            ]
          }
        ]
      },
      plugins: [
        ...
        new MiniCssExtractPlugin({
          filename: '[name].[chunkhash:8].css'
        })
      ]
    }
  ```
- 因为开发环境构建使用HMR, `mini-css-extract-plugin`应该只在`production`环境下使用，并且不需要再使用`style-loader`，针对这个特定，我们需要针对`development`环境和`production`环境进行不同配置。

## 环境配置
  - 将环境配置分为`development`和`production`，分开配置。
  ```js
    // 删除webpack.config.js文件，增加config文件夹
    +-- config
      +-- webpack.base.config.js // 基础配置
      +-- webpack.prod.config.js // 生产环境配置
      +-- webpack.dev.config.js // 开发环境配置
  ```
  `package.json`文件中声明属性
  ```js
    "build": "webpack --config ./config/webpack.prod.js",
    "dev": "webpack --config ./config/webpack.dev.js"
  ```
- 使用`webpack-merge`将通用配置和不同环境下的特定配置合并起来
  ```js
    // webpack.pros.config.js
    const merge = require('webpack-merge')
    const config = require('./webpack.base.config.js')
    process.env.NODE_ENV = 'production'
    module.exports = merge(config, {
      mode: 'production'，
        // 在production环境中，可以使用chunkhash/contenthash
      output: {
        filename: 'js/[name].[contenthash:8].js',
        path: resolve('dist'),
        // 结合webpack的魔法注释，自定义打包后的文件名称 /* webpackChunkName: "About"*/
        chunkFilename: 'js/[name].[contenthash:8].js'
      }
    })

    // webpack.dev.config.js
    const merge = require('webpack-merge')
    const config = require('./webpack.base.config.js')
    process.env.NODE_ENV = 'development'
    module.exports = merge(config, {
      mode: 'development'，
      // 在development环境中，只能使用hash，不能使用chunkhash或者contenthash
      output: {
        filename: 'js/[name].[hash].js',
        path: resolve('dist'),
        // 结合webpack的魔法注释，自定义打包后的文件名称 /* webpackChunkName: "About"*/
        chunkFilename: 'js/[name].[hash].js'
      }
    })
    
    // webpack.base.config.js
    module.exports = {
      ...
      rules: [
        ...
        {
          test: /\.scss$/,
          loader: [
            process.env.NODE_ENV === 'procution' ? MiniCssExtractPlugin.loader: 'vue-syle-loader',
            'css-loader',
            'postcss-loader',
            'sass-loader'
          ]
        }
        ...
      ]
      ...
    }
  ```
- webpack4即使没有声明`webpack.config.js`也能正常工作，因为，webpack4有默认配置。
- 需要了解[mode的工作模式](https://webpack.docschina.org/configuration/mode/)，不同的模式下webpack会开启不同的配置和优化，所以webpack4中mode是一个需要指定的配置，如果不指定的话，默认是production。
- mode的值会传给[DefinePlugin](https://webpack.docschina.org/plugins/define-plugin/)，设置`process.env.NODE_ENV`的值，但是在DefindPlugin中配置`process.env.NODE_ENV`并不会将mode的值配置成对应的值。
- 无论是mode的值还是DefindPlugin中配置`process.env.NODE_ENV`的值，都是在构建之后存在全局作用域给用户使用的，构建过程中，需要主动声明才能使用，否则无法得到想要的结果。

## 图片资源处理
  - 图片资源的处理使用`url-loader`和`file-loader`, `npm install url-loader file-loader`
  ```js
    module.exports = {
      ...
      module: {
        rules: [
          ...
          {
            test: /\.(png|jpe?g|gif|webp)(\?.*)?$/,
            use: {
              loader: 'url-loader',
              options: {
                limit: 2 * 1024,
                fallback: {
                  loader: 'file-loader',
                  options: {
                    name(resourcePath, resourceQuery) {
                      if (process.env.NODE_ENV === 'production') {
                        return 'img/[name].[contenthash:8].[ext]'
                      } else {
                        return 'img/[name].[ext]'
                      }
                    },
                    esModule: false
                  }
                }
              }
            }
          }
        ]
      }
    }
  ```
  - `url-loader`将小于limit的图片资源以base64编码的字符串注入到包中，但是如果图片巨大，将会导致对应的js/css文件巨大，带来加载缓慢的问题。所以，当图片大小超过limit规定的大小时，默认使用file-loader进行处理。
  - `file-loader`可以把js/css文件中导入图片资源的语句替换成正确的路径，无论是css中以url方式引入的，还是html src引入的，或者是require引入的，都会经过file-loader处理，替换成正确的路径。
  - 超过限制时，默认会采用`file-loader`打包，`file-loader`在v5版本之后，`esModule`默认为true，但是浏览器只能加载CommonJS，所以暂时还需要关闭。

## 使用ES6
  - `babel-loader`可以让我们使用ES6等新语法
  - `npm install bebel-loader @babel/preset-env @babel/plugin-transform-runtime @babel/core -D`
  ```js
    // webpack.base.config.js
    ...
    rules: [
      ...
      {
        test: /\.js$/,
        loader: 'bebal-loader',
        exclude: resolve('node_modules')
      }
    ]

    // .babelrc
    {
      "presets": ["@babel/preset-env"],
      "plugins": ["@babel/plugin-transform-runtime"]
    }
  ```
  - 使用`exclude`去掉不需要使用babel处理的第三方库，减少打包时间。

## devServer
  - 开发环境下，使用[HMR](https://webpack.docschina.org/concepts/hot-module-replacement/)来加快开发速度。
  ```js
    // webpack.dev.config.js
    // 使用devsServer时webpack 监听模式时默认开启的watch:true， 默认情况下是false
    const webpack = require('webpack')
    module.exports = {
      ...
      devServer: {
        contentBase: resolve('dist'),
        compress: true,
        hot: true
      }
      ...
      plugin: [
        new webpack.HotModuleReplacementPlugin()
      ]
    }

    // package.json的script这种增加一个命令
    "serve": "webpack-dev-server --config ./config/webpack.dev.js"
  ```

## Code Splitting

使用Code Splitting功能将公共的代码抽出来，避免重复打包。

- webpack code splitting的功能主要来自`SplitChunksPlugin`，这是一个开箱即用的插件;
- `SplitChunksPlugin`默认情况下只会作用于按需加载的模块，webpack自动进行代码切割的情况有一下几种：
  - 可以共享的新模块或者来自于node_module的模块；
  - 压缩前大于20kb的新模块；
  - 当并行加载的按需加载模块最大数量小于或等于30；
  - 当初始页面并行请求的最大数量小于或等于30。
  ```js
    ...
    module.exports = {
      ...
      optimization: {
        splitChunks: {
          // minSize的默认值是20000b
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
    }
    ...
  ```

  ## 其他配置
  ```js
      resolve: {
      alias: {
        // 只会命中以vue结尾的导入语句
        'vue$': 'vue/dist/vue.runtime.esm.js',
        '@': '../src'
      },
      // 解析的时候如果有同名文件，会先使用js文件
      extensions: [
        '.js',
        '.vue',
        '.json'
      ],
      // webpack去那些目录下寻找第三方模块，默认只会去node_modules下寻找
      modules: [
        'node_modules'
      ]
    }
  ```
  - alias声明引入时的一些别名，可以缩小文件查找范围；
  - extensions声明引入文件的时候省略的文件类型名；

 ## 参考资料
 - [《深入浅出webpack》](http://www.xbhub.com/wiki/webpack/)
 - [webpack文档](https://webpack.docschina.org/api/)
 - [从零配置webpack 4+react脚手架](https://github.com/vortesnail/blog/issues/6)

## 总结
  以上只是一些webpack萌新入门的基础知识，本来难登大雅之堂，之所以还是写出来的原因有二，一是为了让自己进一步熟悉；二是希望和我一样想学习webpack的小萌新不走弯路（因为之前直接从脚手架的基础上再来搭建webpack，工作复杂，每每放弃）。

  



