const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');

module.exports = {
    entry: {
        bundle: ['./modeler-component/QuantumWorkflowModeler.js']
    },
    output: {
        filename: 'index.js',
        path: path.resolve(__dirname, 'public'),
    },

    module: {
        rules: [
            {
                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/inline',
            },
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/i,
                type: 'asset/inline',
            },
            {
                test: /\.(less|css)$/i,
                use: [
                    "css-loader",
                    "less-loader",
                ],
            },
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: "babel-loader",
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                        }
                    },
                    // 'css-loader',
                ]
            },
            {
                test: /\.bpmn$/,
                type: "asset/source",
            },
        ],
    },
    resolve: {
        extensions: ['.jsx', '.js']
    },
    mode: 'development',
    devtool: 'source-map',
};
