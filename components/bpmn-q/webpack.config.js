const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');
// const autoprefixer = require('autoprefixer');

module.exports = {
    entry: {
        bundle: [ './modeler-component/QuantumWorkflowModeler.js' ]
    },
    output: {
        path: path.resolve(__dirname, 'public'),
        filename: 'index.js',
        // library: 'quantumWorkflowModeler',
        // libraryTarget: 'umd',
        // globalObject: 'this'
        // publicPath: '/public/',
        // globalObject: 'this',
        // library: {
        //     name: 'quantumWorkflowModeler',
        //     type: 'umd',
        // },
    },
    // devServer: {
    //     static: {
    //         directory: path.join(__dirname, 'dist'),
    //     },
    // },
    module: {
        rules: [
            {
                test: /\.bpmn$/,
                type: "asset/source",
            },
            // {
            //     test: /\.(png|jpe?g|gif|svg)$/i,
            //     type: "asset/resource",
            //     generator: {
            //         filename: "images/[hash][ext][query]",
            //     },
            // },
            // {
            //     test: /\.css$/i,
            //     use: ["style-loader", "css-loader", {
            //         loader: 'postcss-loader',
            //         // options: {
            //         //     postcssOptions: {
            //         //         plugins: ['autoprefixer'],
            //         //     },
            //         // },
            //     }],
            // },
            {
                // test: /\.(png|jpe?g|gif|svg)(\?\S*)?$/,
                // use: [
                //     {
                //         loader: 'react-url-loader',
                //         options:
                //             {
                //                 publicPath: '',
                //                 publicStylePath: '../',
                //                 name: 'images/[name].[ext]?[hash]'
                //             },
                //     }
                // ]
            },
            {

                test: /\.(png|svg|jpg|jpeg|gif)$/i,
                type: 'asset/resource',
                // loader: 'url-loader',
                // options: {
                //     limit: 8192,
                //     name: '[name].[ext]',
                //     outputPath: 'images'
                // }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
                // use: [
                //     "style-loader",
                //     // 'css-loader',
                //     // {
                //     //     loader: 'style-loader',
                //     //     options: {
                //     //         sourceMap: true,
                //     //     }
                //     // },
                //     {
                //         loader: 'css-loader',
                //         options: {
                //             sourceMap: true,
                //             importLoaders: 2
                //         }
                //     },
                //     {
                //         loader: 'postcss-loader',
                //         options: {
                //             sourceMap: true
                //         }
                //     },
                //     // {
                //     //     loader: 'resolve-url-loader',
                //     //     options: {
                //     //         attempts: 1,
                //     //         sourceMap: true
                //     //     }
                //     // },
                //     // {
                //     //     loader: 'css-loader',
                //     //     options: {
                //     //         url: true // disable url handling by css-loader
                //     //     }
                //     // },
                //     // {
                //     //     loader: 'url-loader',
                //     //     options: {
                //     //         // esModule: true, // required to correctly handle images in css
                //     //         limit: 8192,
                //     //         name: '[path][name].[ext]',
                //     //         outputPath: 'assets/', // path to output directory
                //     //         publicPath: '/public/assets/' // public URL of the output directory
                //     //     }
                //     // }
                //     // {
                //     //     loader: 'file-loader',
                //     //     options: {
                //     //         name: '[name].[ext]',
                //     //         outputPath: 'assets/', // path to output directory
                //     //         publicPath: '/public/assets/' // public URL of the output directory
                //     //     }
                //     // }
                // ],
                // // use: ["style-loader", "css-loader"],
                // // use: [
                // //     'style-loader',
                // //     {
                // //         loader: 'css-loader',
                // //         options: {
                // //             importLoaders: 1
                // //         }
                // //     },
                // //     'postcss-loader'
                // // ]
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
            // {
            //     test: /\.(png|jpe?g|gif)$/i,
            //     use: [
            //         {
            //             loader: 'url-loader',
            //             options: {
            //                 limit: 8192,
            //                 name: '[name].[ext]',
            //                 outputPath: 'images/'
            //             },
            //         },
            //     ],
            // },
            // {
            //     test: /\.css$/i,
            //     use: [
            //         'style-loader',
            //         'css-loader',
            //     ],
            // },
            // {
            //     test: /\.css$/,
            //     use: [
            //         'style-loader',
            //         {
            //             loader: 'css-loader',
            //             options: {
            //                 importLoaders: 1,
            //             }
            //         },
            //         'postcss-loader'
            //     ]
            // },
            // {
            //     test: /\.(svg|png|jpg|gif)$/,
            //     use: {
            //         loader: 'file-loader',
            //         options: {
            //             name: '[name].[ext]',
            //             outputPath: 'icons/'
            //         }
            //     }
            // },
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
            { from: '**/*.{html,css}', context: 'app/' },
            // { from: '**/*.{png, jpg, svg}', context: 'public/resources/'}
        ])
    ],
    mode: 'development',
    devtool: 'source-map'
};