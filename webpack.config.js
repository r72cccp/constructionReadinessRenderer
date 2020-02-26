const path = require('path');
const alias = require('./webpack.alias');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function(env) {
  return {
    entry: [
      './src/main.ts',
    ],
    mode: env.production ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              options: {
                sourceMap: true,
              },
            },            
            {
              loader: 'less-loader',
              options: {
                sourceMap: true,
              },
            }
          ]
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        
      })],
    },
    output: {
      path: path.resolve(__dirname, 'dist/js'),
      filename: 'bundle.js',
    },
    resolve: {
      alias,
      extensions: [ '.tsx', '.ts', '.js', '.less' ],
    },
  };
};
