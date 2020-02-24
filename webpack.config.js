const path = require('path');
const alias = require('./webpack.alias');

module.exports = function(env) {
  return {
    mode: env.production ? 'production' : 'development',
    entry: './ts/main.ts',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [ '.tsx', '.ts', '.js' ],
      alias,
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    }
  }
};
