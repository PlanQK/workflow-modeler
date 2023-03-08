const CopyWebpackPlugin = require('copy-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        bundle: [ './modeler-component/QuantumWorkflowModeler.js' ]
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'index.js',
        publicPath: '/',
        library: 'quantumWorkflowModeler',
        libraryTarget: 'umd',
        umdNamedDefine: true,
        // globalObject: 'this'
    //     globalObject: 'this',
    //     library: {
    //         name: 'quantumWorkflowModeler',
    //         type: 'umd',
    //     },
    },

    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.bpmn$/,
                type: "asset/source",
            },
            {

                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'image/[name][hash][ext]'
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader", 'postcss-loader'],
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
    optimization: {
        minimize: true,
        minimizer: [
            new TerserPlugin({
                extractComments: false,
                terserOptions: {
                    format: {
                        comments: false
                    }
                }
            })
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: 'assets/**', to: 'vendor/bpmn-js', context: 'node_modules/bpmn-js/dist/' },
            { from: '**/*.{html,css}', context: 'app/' },
            { from: 'public/**/*.css' },
            { from: 'public/image/**/*', to: 'image', flatten: true }
            // { from: '**/*.{png, jpg, svg}', context: 'public/resources/'}
        ]),
        // new CleanWebpackPlugin()
    ],
    mode: 'development',
    devtool: 'source-map'
};