const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require('path');
const webpack = require('webpack');

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
                    "style-loader",
                    "css-loader",
                    "less-loader",
                ],
            },
            {
                test: /\.bpmnlintrc$/i,
                use: 'bpmnlint-loader',
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
    plugins: [
        new MiniCssExtractPlugin({
          filename: 'modeler-styles.css'
        }),
        // use the default values if environment variable does not exist
        new webpack.EnvironmentPlugin({
            AWS_RUNTIME_HANDLER_ENDPOINT: 'http://localhost:8890',
            CAMUNDA_ENDPOINT: 'http://localhost:8080/engine-rest',
            DATA_CONFIG: 'http://localhost:8100/data-objects',
            ENABLE_DATA_FLOW_PLUGIN: true,
            ENABLE_PLANQK_PLUGIN: true,
            ENABLE_QHANA_PLUGIN: true,
            ENABLE_QUANTME_PLUGIN: true,
            ENABLE_OPENTOSCA_PLUGIN: true,
            OPENTOSCA_ENDPOINT: 'http://localhost:1337/csars',
            GITHUB_TOKEN: '',
            NISQ_ANALYZER_ENDPOINT: 'http://localhost:8098/nisq-analyzer',
            QISKIT_RUNTIME_HANDLER_ENDPOINT: 'http://localhost:8889',
            QHANA_GET_PLUGIN_URL: 'http://localhost:5006/api/plugins/',
            QHANA_LIST_PLUGINS_URL: 'http://localhost:5006/api/plugins/?item-count=100',
            QRM_USERNAME: '',
            QRM_REPONAME: '',
            QRM_REPOPATH: '',
            SERVICE_DATA_CONFIG: 'http://localhost:8000/service-task',
            SCRIPT_SPLITTER_ENDPOINT: 'http://localhost:8891',
            SCRIPT_SPLITTER_THRESHOLD: 5,
            TRANSFORMATION_FRAMEWORK_ENDPOINT: 'http://localhost:8888',
            WINERY_ENDPOINT: 'http://localhost:8081/winery',
            PROVENANCE_COLLECTION: false
        })
    ],
    mode: 'development',
    devtool: 'source-map',
};
