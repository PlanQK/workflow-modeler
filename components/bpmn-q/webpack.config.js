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
            // {
            //     test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
            //     type: 'asset/resource',
            //     use: [
            //         'file-loader'
            //     ]
            // },
            {
                test: /\.(png|jpg)$/,
                loader: 'file-loader'
            },
            // {
            //     test: /\.(png|jpg)$/,
            //     loader: 'url-loader'
            // },
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
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        cacheDirectory: true,
                        cacheCompression: false,
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.jsx', '.js']
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