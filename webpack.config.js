const webpack = require('webpack');
const path = require('path');

const sourcePath = path.join(__dirname);
const outPath = path.join(__dirname, './build');

const isProd = process.argv.indexOf('-p') >= 0 || process.env.NODE_ENV === 'production';

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackCleanupPlugin = require('webpack-cleanup-plugin');
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = {
  context: sourcePath,
  mode: isProd ? 'production' : 'development',
  entry: {
    app: ['react-hot-loader/patch', './src/main.tsx']
  },
  output: {
    path: outPath,
    publicPath: '/',
    filename: '[hash].js',
    chunkFilename: '[name].[hash].js'
  },
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    mainFields: ['module', 'browser', 'main'],
    plugins: [
      new TsconfigPathsPlugin({
        configFile: path.join(__dirname, 'tsconfig.json')
      })
    ],
    alias: {
      'react-dom': '@hot-loader/react-dom',
      'react': require.resolve('./node_modules/react'),
    }
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            cacheDirectory: true,
            babelrc: false,
            presets: [
              '@babel/preset-env',
              '@babel/preset-typescript',
              '@babel/preset-react'
            ],
            plugins: [
              ['@babel/plugin-proposal-decorators', { legacy: true }],
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              '@babel/plugin-proposal-optional-chaining',
              isProd ? null : 'react-hot-loader/babel'
            ].filter(Boolean)
          }
        }
      },
      {
        test: /\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            query: {
              modules: true,
              sourceMap: true
            }
          }
        ]
      },
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.(a?png|svg)$/, use: 'url-loader?limit=10000' },
      {
        test: /\.(jpe?g|gif|bmp|mp3|mp4|ogg|wav|eot|ttf|woff|woff2)$/,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new WebpackCleanupPlugin(),
    new MiniCssExtractPlugin({
      filename: '[hash].css'
    }),
    new HtmlWebpackPlugin({
      template: 'src/assets/index.html'
    })
  ],
  devServer: {
    port: 3000,
    hot: true,
    historyApiFallback: true
  },
  devtool: isProd ? false : 'cheap-module-eval-source-map'
};
