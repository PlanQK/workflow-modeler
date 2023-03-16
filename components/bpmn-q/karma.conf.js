'use strict';

module.exports = function(karma) {
    karma.set({

        frameworks: [
            'browserify',
            'mocha',
            'sinon-chai'
        ],

        files: [
            'modeler-component/**/*Spec.js',
        ],

        reporters: [ 'dots' ],

        preprocessors: {
            'modeler-component/**/*Spec.js': [ 'browserify' ]
        },

        browsers: ['Firefox'],

        browserNoActivityTimeout: 30000,

        singleRun: true,
        autoWatch: false,

        // browserify configuration
        browserify: {
            debug: true,
            transform: [
                [ 'babelify', {
                    global: true,
                    babelrc: false,
                    presets: [ 'env' ]
                } ],
                [ 'stringify', {
                    global: true,
                    extensions: [
                        '.bpmn',
                        '.css'
                    ]
                } ]
            ]
        }
    });
};