const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        bundle: [ './modeler-component/QuantumWorkflowModeler.js' ]
    },
    output: {
        path: __dirname + '/public',
        filename: 'app.js'
    },
    module: {
        rules: [
            {
                test: /\.bpmn$/,
                use: 'raw-loader'
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.less$/i,
                use: [
                    // compiles Less to CSS
                    "style-loader",
                    "css-loader",
                    "less-loader",
                ],
            },
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'assets/**', to: 'vendor/bpmn-js', context: 'node_modules/bpmn-js/dist/' },
            { from: '**/*.{html,css}', context: 'app/' }
        ])
    ],
    mode: 'development',
    devtool: 'source-map'
};