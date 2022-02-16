const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const config = {
  entry: {
    addrecipes: './src/main/resources/static/js/addrecipes/addrecipes.jsx',
    ingredienteditor: './src/main/resources/static/js/ingredienteditor/ingredienteditor.jsx',
    uniteditor: './src/main/resources/static/js/uniteditor/uniteditor.jsx',
    recipeeditor: './src/main/resources/static/js/recipeeditor/recipeeditor.jsx',
    recipetypeeditor: './src/main/resources/static/js/recipetypeeditor/recipetypeeditor.jsx',
    mealtypeeditor: './src/main/resources/static/js/mealtypeeditor/mealtypeeditor.jsx',
    recipecategorieseditor: './src/main/resources/static/js/recipecategorieseditor/recipecategorieseditor.jsx',
    planner: './src/main/resources/static/js/planner/planner.jsx'
  },

  resolve: {
    // Which extensions Webpack will resolve. '...' means to include the
    // defaults (e.g., 'js', etc.) in addition to the extra entries.
    extensions: ['.jsx', '...'],
  },

  output: {
    filename: '[name]/[name].bundle.js',
    // eslint-disable-next-line no-undef
    path: path.resolve(__dirname, 'target/classes/static/js/'),
  },

  module: {
    rules: [
      {
        test: /\.?jsx$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-react'],
            cacheDirectory: true
          }
        }
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      }
    ]
  },

  optimization: {
    minimize: true,
    minimizer: [new TerserPlugin({
      extractComments: true,
      parallel: true,
      terserOptions: {
        module: true,
        compress: {
          ecma: 6,
          drop_console: true,
          unsafe_methods: true
        },
        mangle: {
          module: true
        }
      }
    })],
  },

  plugins: [
    // Bring in jQuery automatically if a file references $ or jQuery.
    // TODO: Get rid of jQuery.
    //       https://github.com/joeltine/meal-planner/issues/87
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery'
    }),
    new MiniCssExtractPlugin({
      // This is relative to output.path.
      filename: '../css/[name]/[name].bundle.css'
    })
  ]
};

module.exports = (env, argv) => {
  config.mode = argv.mode || 'production';

  if (config.mode === 'development') {
    config.devtool = 'eval-source-map';
  }

  return config;
};
