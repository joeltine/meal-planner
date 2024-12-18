// Karma configuration

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: 'src/main/resources/static/',

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['jasmine', 'webpack'],

    // list of files / patterns to load in the browser
    files: [
      '**/*test.js',
      '**/*test.jsx',
      '**/*test.html'
    ],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      '**/*test.js': ['webpack'],
      '**/*test.jsx': ['webpack'],
      '**/*test.html': ['html2js']
    },

    webpack: {
      'mode': 'development',

      resolve: {
        // Which extensions Webpack will resolve. "..." means to include the
        // defaults (e.g., "js", etc.) in addition to the extra entries.
        extensions: ['.jsx', '...']
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

      plugins: [
        // Bring in jQuery automatically if a file references $ or jQuery.
        // TODO: Get rid of jQuery.
        new webpack.ProvidePlugin({
          $: 'jquery',
          jQuery: 'jquery'
        }),
        new MiniCssExtractPlugin({
          // This is relative to output.path.
          filename: '../css/[name]/[name].bundle.css'
        })
      ]
    },

    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['progress'],

    // web server port
    port: 9876,

    // enable / disable colors in the output (reporters and logs)
    colors: true,

    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR ||
    // config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_ERROR,

    // enable / disable watching file and executing tests whenever any file
    // changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ['Chrome'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: 5
  });
};
