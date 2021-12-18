const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  entry: {
    addrecipes: './src/main/resources/static/js/addrecipes/addrecipes.js',
    'third-party': './src/main/resources/static/js/third-party/third-party.js',
  },

  output: {
    filename: '[name]/[name].bundle.js',
    path: path.resolve(__dirname, 'src/main/resources/static/js/'),
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: false,
      parallel: true,
    })],
  },
};

module.exports = (env, argv) => {
  if (argv.mode === 'development') {
    config.devtool = 'eval-source-map';
  }

  if (argv.mode === 'production') {
    config.devtool = 'source-map';
  }

  return config;
};