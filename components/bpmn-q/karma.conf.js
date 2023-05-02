// Karma configuration
const webpackConfig = require('./webpack.config.js');

const customLaunchers = {
  CustomBrowser: {
    base: 'ChromeHeadless',
    flags: ['--disable-translate', '--disable-extensions', '--disable-background-networking', '--safebrowsing-disable-auto-update', '--disable-sync', '--metrics-recording-only', '--disable-default-apps', '--no-first-run', '--disable-setuid-sandbox', '--disable-web-security'],
    debug: true,
    sequential: true, // add this option to run tests sequentially
  },
};

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ['mocha', 'webpack'],


    // list of files / patterns to load in the browser
    files: [
      'test/**/*.spec.js'
    ],


    // list of files / patterns to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      'test/**/*.spec.js': ['webpack']//[ 'browserify' ]
    },


    webpack: webpackConfig,
    webpackMiddleware: {
      noInfo: true
    },
    // browserify: {
    //   // entries: ['modeler-component/QuantumWorkflowModeler.js'],
    //   debug: true,
    //   transform: [
    //     [ 'browserify-css', 'babelify', { presets: [ '@babel/preset-env' ] } ]
    //   ]
    // },


    plugins: ['karma-mocha', 'karma-browserify', 'karma-chrome-launcher', 'karma-webpack'],


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://www.npmjs.com/search?q=keywords:karma-reporter
    reporters: ['progress'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    // browsers: ['ChromeHeadless'],
    customLaunchers: customLaunchers,
    browsers: ['CustomBrowser'],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: 1
  });
};
