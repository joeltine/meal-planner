const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  plugins : [ new ESLintPlugin(options) ],

  entry : {
    addrecipes : './src/main/resources/static/js/addrecipes/addrecipes.js',
  },

  output : {
    filename : '[name]/[name].bundle.js',
    path : path.resolve(__dirname, 'src/main/resources/static/js/'),
  },
};
