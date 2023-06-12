// Karma configuration
const webpackConfig = require('./webpack.config.js');

module.exports = function (config) {
    config.set({

        // base path that will be used to resolve all patterns (eg. files, exclude)
        basePath: '',

        // frameworks to use
        // available frameworks: https://www.npmjs.com/search?q=keywords:karma-adapter
        frameworks: ['mocha', 'webpack'],

        // list of files / patterns to load in the browser
        files: [
            'test/tests/editor/configurations.spec.js',
            'test/tests/editor/editor.spec.js',
            'test/tests/editor/plugin.spec.js',
            'test/tests/planqk/planqk-transformation.spec.js',
            'test/tests/editor/utils/modelling-util.spec.js',
            'test/tests/qhana/qhana-plugin-config.spec.js',
            'test/tests/qhana/qhana-service-configs.spec.js',
            'test/tests/quantme/quantme-transformation.spec.js',
            'test/tests/quantme/data-object-configs.spec.js',
            'test/tests/quantme/quantme-config.spec.js',
            'test/tests/opentosca/opentosca-config.spec.js',
            'test/tests/opentosca/deployment-utils.spec.js',
            'test/tests/dataflow/data-flow-transformation.spec.js',
            'test/tests/dataflow/data-flow-plugin-config.spec.js',
            'test/tests/dataflow/data-flow-configurations-endpoint.spec.js',
            'test/tests/dataflow/data-flow-palette.spec.js',
            'test/tests/dataflow/data-flow-replace-menu.spec.js',
        ],

        // list of files / patterns to exclude
        exclude: [],

        // preprocess matching files before serving them to the browser
        // available preprocessors: https://www.npmjs.com/search?q=keywords:karma-preprocessor
        preprocessors: {
            'test/**/*.spec.js': ['webpack']
        },

        webpack: webpackConfig,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // start these browsers
        // available browser launchers: https://www.npmjs.com/search?q=keywords:karma-launcher
        browsers: ['ChromeHeadless'],

        // Continuous Integration mode
        // if true, Karma captures browsers, runs the tests and exits
        singleRun: true,

        // Concurrency level
        // how many browser instances should be started simultaneously
        concurrency: 1,

        mochaReporter: {
            output: "minimal"
        },
    });
};