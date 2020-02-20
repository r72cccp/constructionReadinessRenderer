const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

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
    },
    optimization: {
      minimizer: [
        new UglifyJsPlugin({
          uglifyOptions: {
            beautify: false,
            comments: false,
            compress: {
              sequences: true,
              booleans: true,
              loops: true,
              unused: true,
              drop_console: true,
              unsafe: true
            }
          }
        })
      ],
    },    
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'bundle.js'
    }
  }
};
