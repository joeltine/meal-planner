const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

const config = {
  entry: {
    addrecipes: './src/main/resources/static/js/addrecipes/addrecipes.js',
    ingredienteditor: './src/main/resources/static/js/ingredienteditor/ingredienteditor.js',
    uniteditor: './src/main/resources/static/js/uniteditor/uniteditor.jsx',
    recipeeditor: './src/main/resources/static/js/recipeeditor/recipeeditor.js',
    planner: './src/main/resources/static/js/planner/planner.js',
    'third-party': './src/main/resources/static/js/third-party/third-party.js',
  },

  resolve: {
    // Which extensions Webpack will resolve. "..." means to include the
    // defaults (e.g., "js", etc.) in addition to the extra entries.
    extensions: ['.jsx', '...'],
  },

  output: {
    filename: '[name]/[name].bundle.js',
    path: path.resolve(__dirname, 'target/classes/static/js/'),
  },

  module: {
    rules: [
      {
        test: /\.?jsx$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ['@babel/preset-react'],
            cacheDirectory: true
          }
        }
      },
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
          booleans_as_integers: true,
          drop_console: true,
          unsafe_methods: true
        },
        mangle: {
          module: true
        }
      }
    })],
  },
};

module.exports = (env, argv) => {
  config.mode = argv.mode || 'production';

  if (config.mode === 'development') {
    config.devtool = 'eval-source-map';
  }

  if (config.mode === 'production') {
    config.devtool = 'source-map';
  }

  return config;
};