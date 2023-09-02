// Karma configuration
const webpackConfig = require("./webpack.config.js");

module.exports = function (config) {
  config.set({
    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: "",

    // frameworks to use
    // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
    frameworks: ["mocha", "webpack"],

    // list of files / patterns to load in the browser
    files: ["test/**/*.spec.js", "modeler-component/*.js"],

    // list of files / patterns to exclude
    exclude: [],

    // preprocess matching files before serving them to the browser
    // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
    preprocessors: {
      "test/**/*.spec.js": ["webpack"],
      "modeler-component/*.js": ["babel", "coverage"],
    },

    reporters: ["coverage"],

    plugins: [
      "karma-babel-preprocessor",
      "karma-chrome-launcher",
      "karma-webpack",
      "karma-coverage",
      "karma-mocha",
    ],

    webpack: webpackConfig,

    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,

    // start these browsers
    // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
    browsers: ["ChromeHeadless"],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: true,

    // Concurrency level
    // how many browser instances should be started simultaneously
    concurrency: 1,

    mochaReporter: {
      output: "minimal",
    },
  });
};
