const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const __PROD__ = process.env.NODE_ENV === 'production';
const __PROD_DB__ = process.env.DB === 'production';
const __DEV__ = !__PROD__;
const define = {
  __DEV__: JSON.stringify(__DEV__),
  __PROD__: JSON.stringify(__PROD__),
  // 是否内嵌调试工具
  __DEVTOOLS__: JSON.stringify(__DEV__),
  // React等库通过process.env.NODE_ENV变量判断是否运行于生产环境。
  'process.env': {
    NODE_ENV: JSON.stringify(__PROD__ ? 'production' : 'development')
  },
  // 后台Api地址
  __API_BASE__: JSON.stringify(
    __PROD_DB__ ? 'http://101.200.51.147:8080' : 'http://47.95.49.71/api'
  )
};
// __dirname是node.js中的一个全局变量，它指向当前执行脚本所在的目录
module.exports = {
  // 注意这里是exports不是export
  entry: [
    'babel-polyfill',
    'whatwg-fetch',
    'normalize.css',
    path.join(__dirname, 'src/index.jsx')
  ], // 唯一入口文件，就像Java中的main方法
  output: {
    // 输出目录
    path: `${__dirname}/build`, // 打包后的js文件存放的地方
    filename: 'bundle.js' // 打包后的js文件名
  },
  resolve: {
    extensions: ['.js', '.jsx']
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          passPerPreset: true,
          presets: [
            {plugins: ['transform-runtime']},
            {
              passPerPreset: false,
              presets: ['es2015', 'stage-0', 'react']
            }
          ]
        }
      },

      {
        test: /\.(jpe?g|png|gif|svg|xlsx|eot|woff|woff2|ttf|svg)$/i,
        loader: 'file-loader'
      },
      {
        test: /\.css$/i,
        include: path.join(__dirname, 'src'),
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader?modules&localIdentName=[local]___[hash:base64:5]'
        })
      },
      {
        test: /\.css$/i,
        exclude: path.join(__dirname, 'src'),
        loader: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: 'css-loader'
        })
      }
    ]
  },
  plugins: [
    // 定义JavaScript中__PROD__等常量的值
    new webpack.DefinePlugin(define),
    // 生成一个index.html
    new HtmlWebpackPlugin({
      minify: {},
      template: path.join(__dirname, 'src/index.html')
    }),
    // 将CSS单独输出，提升加载速度
    new ExtractTextPlugin({
      filename: 'style.css',
      disable: false,
      allChunks: true
    })
  ].concat(
    __PROD__
      ? [
          // 优化并混淆JavaScript代码
        new webpack.optimize.UglifyJsPlugin({
          output: {comments: false},
          compress: {warnings: false},
          sourceMap: false
        })
      ]
      : []
  )
};
