const path = require('path');
const alias = require('./webpack.alias');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = function(env) {
  return {
    entry: [
      './ts/main.ts',
    ],
    mode: env.production ? 'production' : 'development',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin({
        
      })],
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js',
    },
    resolve: {
      alias,
      extensions: [ '.tsx', '.ts', '.js' ],
    },
  };
};
