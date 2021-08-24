const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')

// ******************web打包***************************************************
let baseconfig = {
  target: 'web',
  entry: {
    // index: './z_Report/index.js'
  },
  devtool: process.env.NODE_ENV === 'development' ? 'source-map' : undefined, // 输出 Source Map 方便在浏览器里调试 TypeScript 代码
  output: {
    clean: true,
    // 输出文件都放到 dist 目录下
    // path: path.resolve(__dirname, './dists/dist_report'),
    // 把所有依赖的模块合并输出到一个 bundle.js 文件
    filename: '[name][chunkhash:8].js',
    chunkFilename: '[name].[chunkhash:8].chunk.js',
    sourceMapFilename: process.env.NODE_ENV === 'development' ? '[file].map' : undefined,
    devtoolModuleFilenameTemplate: 'webpack:///[resource-path]'
  },
  experiments: {
    topLevelAwait: true
  },
  module: {
    rules: [
      {
        // 命中 JavaScript 文件
        test: /\.(js|ts|jsx|tsx)$/,
        // 用 babel-loader 转换 JavaScript 文件
        // ?cacheDirectory 表示传给 babel-loader 的参数，用于缓存 babel 编译结果加快重新编译速度
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['@babel/plugin-syntax-top-level-await']
          }
        },
        // 只命中src目录里的js文件，加快 Webpack 搜索速度
        include: __dirname,
        exclude: /node_modules/
      },
      {
        //vue ts文件需要
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          appendTsSuffixTo: [/\.vue$/]
        },
        include: __dirname,
        exclude: /node_modules/
      },
      {
        test: /\.js$/,
        // 只加载你关心的目录下的 Source Map，以提升构建速度
        use: ['source-map-loader'],
        // 要把 source-map-loader 的执行顺序放到最前面，如果在 source-map-loader 之前有 Loader 转换了该 JavaScript 文件，会导致 Source Map 映射错误
        enforce: 'pre',
        include: [path.resolve(__dirname, 'node_modules/')]
      },
      {
        //样式不需要模块化-我们项目只用less或者scss模块化
        test: /\.(stylus)$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'stylus-loader'],
        include: __dirname
      },

      {
        //模块化的css,自定义的全局样式请加:global
        test: /\.module\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                // 启用 css modules, css模块化, 所有类名都默认为当前组件, 或者使用 :global 声明全局样式, 参考 AntDesignPro 的样式引用
                localIdentName: '[name]__[local]--[hash:base64:5]' // 指定样式名
              },
              importLoaders: 0
            }
          }
        ]
      },
      {
        //非模块化的css
        test: /\.css$/,
        exclude: /\.module\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
      {
        //模块化的less,自定义的全局样式请加:global
        test: /\.module\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                // 启用 css modules, css模块化, 所有类名都默认为当前组件, 或者使用 :global 声明全局样式, 参考 AntDesignPro 的样式引用
                localIdentName: '[name]__[local]--[hash:base64:5]' // 指定样式名
              },
              importLoaders: 2
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        //非模块化的less
        test: /\.less$/,
        exclude: /\.module\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true
              }
            }
          }
        ]
      },
      {
        //模块化的sass|scss,自定义的全局样式请加:global
        test: /\.s[ac]ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                // 启用 css modules, css模块化, 所有类名都默认为当前组件, 或者使用 :global 声明全局样式, 参考 AntDesignPro 的样式引用
                localIdentName: '[name]__[local]--[hash:base64:5]' // 指定样式名
              }
            }
          },
          'sass-loader'
        ],
        exclude: /node_modules/
        // 排除 node_modules 目录下的文件
      },

      {
        //非模块化的sass|scss
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
        include: /node_modules/
      },
      {
        // 对非文本文件采用 file-loader 加载
        test: /\.(gif|png|jpe?g|eot|woff|ttf|svg|pdf|woff2)$/,
        use: ['file-loader']
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      }
    ]
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   'window.jQuery': 'jquery'
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: `[name]_[contenthash:8].[ext]`
    }),

    // 所有页面都会用到的公共代码提取到 common 代码块中
    new webpack.optimize.SplitChunksPlugin({
      chunks: 'all', // initial、async和all
      maxAsyncRequests: 5, // 按需加载时候最大的并行请求数
      maxInitialRequests: 3, // 最大初始化请求数
      automaticNameDelimiter: '~', // 打包分割符
      name: true,
      minSize: 128 * 1024, // 形成一个新代码块最小的体积
      maxSize: 512 * 1024,
      cacheGroups: {
        vendors: {
          // 基本框架
          chunks: 'all',
          test: /(react|react-dom|react-dom-router|babel-polyfill|mobx)/,
          priority: 100,
          name: 'vendors'
        },
        antVenodr: {
          test: /ant/,
          priority: 100, // 设置高于async-commons，避免打包到async-common中
          name: 'antVenodr',
          chunks: 'async'
        },
        nodemoudles: {
          test: /[\\/]node_modules[\\/]/,
          priority: 100, // 高于async-commons优先级
          name: 'nodemoudles',
          chunks: 'async'
        },
        'async-commons': {
          // 其余异步加载包
          chunks: 'async',
          minChunks: 2,
          name: 'async-commons',
          priority: 90
        },
        commons: {
          // 其余同步加载包
          chunks: 'all',
          minChunks: 2,
          name: 'commons',
          priority: 80
        }
      }
    }),

    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(process.env)
    })
  ],

  resolve: {
    modules: [
      // 寻找模块的根目录，array 类型，默认以 node_modules 为根目录
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, 'src')
      // path.resolve(__dirname, 'z_Report')
    ],
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'], // 模块的后缀名，import时不需要后缀名
    symlinks: true, // 是否跟随文件软链接去搜寻模块的路径
    descriptionFiles: ['package.json'], // 模块的描述文件
    mainFields: ['main', 'index'], // 模块的描述文件里的描述入口的文件的字段名称
    enforceExtension: false, // 是否强制导入语句必须要写明文件后缀

    alias: {
      '@src': path.resolve(__dirname, 'src'), //引入模块时，自动寻找
      // '@': path.resolve(__dirname, 'z_Report')
      path: false, // require.resolve('path-browserify'),
      stream: false, //require.resolve("stream-browserify"),
      http: false, //require.resolve("stream-http"),
      crypto: false, //require.resolve( "crypto-browserify"),
      https: false, //require.resolve( "https-browserify"),
      constants: false, //require.resolve( "constants-browserify"),
      tty: false, //require.resolve( "tty-browserify"),
      zlib: false, //require.resolve( "browserify-zlib"),
      fs: false, // require.resolve( "fs-extra"),
      tls: false,
      dns: false,
      dgram: false,
      net: false, //require.resolve("net"),
      os: false //false,//require.resolve( "os-browserify/browser")
    }
  },
  externals: {
    // 使用来自 JavaScript 运行环境提供的全局变量
    // $: 'jquery',
    // jQuery: 'jquery',
    // 'window.jQuery': 'jquery'
  },
  // 输出文件性能检查配置
  performance: {
    hints: 'warning', // 有性能问题时输出警告
    hints: 'error', // 有性能问题时输出错误
    hints: false, // 关闭性能检查
    maxAssetSize: 200000, // 最大文件大小 (单位 bytes)
    maxEntrypointSize: 1024 * 200, // 最大入口文件大小 (单位 bytes)
    assetFilter: function(assetFilename) {
      // 过滤要检查的文件
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js')
    }
  },

  devServer: {
    // proxy: {
    //   // 代理到后端服务接口
    //   '/api': 'http://localhost:3000'
    // },
    // contentBase: path.resolve(__dirname, 'dists/dist_report'),
    compress: true,
    port: 9000,
    hot: true,
    open: true,
    profile: true // 是否捕捉 Webpack 构建的性能信息，用于分析什么原因导致构建性能不佳
  }
}

module.exports = function initConifg(distDir, projectDir, templateFile, devPort) {
  baseconfig.plugins.push(
    new HtmlWebpackPlugin({
      //
      chunks: 'all', //允许自动注入的chunk
      filename: 'index.html',
      template: `public/${templateFile}`,
      inject: false,
      minify: {
        removeComments: true, //清除注释
        collapseWhitespace: true //清理空格
      }
    })
  )
  baseconfig.plugins.push(
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'public/assets'),
          to: 'assets'
        },
        {
          from: path.resolve(__dirname, `${projectDir}/configs.json`),
          to: `../${distDir}`
        }
      ]
    })
  )
  baseconfig.entry.index = path.resolve(__dirname, `${projectDir}/index.js`)
  baseconfig.devServer.contentBase = path.resolve(__dirname, `dists/${distDir}`)

  baseconfig.devServer.port = devPort
  baseconfig.output.path = path.resolve(__dirname, `dists/${distDir}`)
  baseconfig.resolve.modules.push(path.resolve(__dirname, projectDir))
  // baseconfig.resolve.alias['@'] = path.resolve(__dirname, projectDir)
  baseconfig.resolve.alias['@'] = path.resolve(__dirname, projectDir)
  return baseconfig
}
