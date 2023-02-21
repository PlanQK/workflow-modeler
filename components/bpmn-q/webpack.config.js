const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
    entry: './modeler-component/QuantumWorkflowModeler.js',
    output: {
        filename: 'app.js',
        path: path.resolve(__dirname + '/public'),
        globalObject: 'this',
        library: {
            name: 'qFlowModeler',
            type: 'umd',
        },
    },
    module: {
        rules: [
            {
                test: /\.bpmn$/,
                use: 'raw-loader'
            },
            {

                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
            },
            // {
            //     test: /\.(png|jpg|jpeg|gif|ico|svg)$/,
            //     type: 'asset/resource',
            //     use: [
            //         'file-loader'
            //     ]
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
            { from: 'assets/**', to: 'vendor/bpmn-js', context: 'node_modules/bpmn-js/dist/' }
            // { from: '**/*.{html,css}', context: 'app/' }
        ])
    ],
    mode: 'development',
    devtool: 'source-map'
};