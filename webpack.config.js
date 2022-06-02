//@ts-check

'use strict'

const path = require('path')
const ForkTsCheckerPlugin = require('fork-ts-checker-webpack-plugin')
const nodeExternals = require('webpack-node-externals')

module.exports = {
  target: 'webworker',
  entry: './src/extension.ts',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'extension.js',
    libraryTarget: 'commonjs2',
    devtoolModuleFilenameTemplate: '../[resource-path]'
  },
  devtool: 'source-map',
  externals: [
    {
      vscode: 'commonjs vscode'
    },
    nodeExternals()
  ],
  resolve: {
    fallback: {fs: false, path: false},
    mainFields: ['browser', 'module', 'main'],
    extensions: ['.ts']
  },
  stats: 'errors-only',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'esbuild-loader',
        options: {
          loader: 'ts',
          target: 'es2015'
        }
      }
    ]
  },
  plugins: [new ForkTsCheckerPlugin()]
}
