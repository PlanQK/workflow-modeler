const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const path = require("path");
const webpack = require("webpack");

// here are the default values defined, that will be used if the corresponding environment variable is not set
let defaultConfig = {
  AUTOSAVE_INTERVAL: 300000,
  AWS_RUNTIME_HANDLER_ENDPOINT: "http://localhost:8890",
  CAMUNDA_ENDPOINT: "http://localhost:8090/engine-rest",
  DATA_CONFIG:
    "https://raw.githubusercontent.com/PlanQK/workflow-modeler/master/components/bpmn-q/modeler-component/extensions/quantme/configurations/quantmeDataObjects.json",
  DOWNLOAD_FILE_NAME: "quantum-workflow-model",
  ENABLE_DATA_FLOW_PLUGIN: "true",
  ENABLE_PATTERN_PLUGIN: "true",
  ENABLE_PLANQK_PLUGIN: "true",
  ENABLE_QHANA_PLUGIN: "true",
  ENABLE_QUANTME_PLUGIN: "true",
  ENABLE_OPENTOSCA_PLUGIN: "true",
  GITHUB_TOKEN: "",
  OPENTOSCA_ENDPOINT: "http://localhost:1337/csars",
  NISQ_ANALYZER_ENDPOINT: "http://localhost:8098/nisq-analyzer",
  PATTERN_ATLAS_ENDPOINT:
    "http://localhost:1977/patternatlas/patternLanguages/af7780d5-1f97-4536-8da7-4194b093ab1d",
  PATTERN_ATLAS_UI_ENDPOINT: "http://localhost:1978",
  PROVENANCE_COLLECTION: "false",
  QHANA_GET_PLUGIN_URL: "http://localhost:5006/api/plugins/",
  QHANA_LIST_PLUGINS_URL: "http://localhost:5006/api/plugins/?item-count=100",
  QISKIT_RUNTIME_HANDLER_ENDPOINT: "http://localhost:8889",
  QPROV_ENDPOINT: "http://localhost:8099/qprov",
  QRM_USERNAME: "",
  QRM_REPONAME: "",
  QRM_REPOPATH: "",
  SERVICE_DATA_CONFIG: "http://localhost:8000/service-task",
  SCRIPT_SPLITTER_ENDPOINT: "http://localhost:8891",
  SCRIPT_SPLITTER_THRESHOLD: 5,
  TRANSFORMATION_FRAMEWORK_ENDPOINT: "http://localhost:8888",
  UPLOAD_BRANCH_NAME: "",
  UPLOAD_FILE_NAME: "workflow",
  UPLOAD_GITHUB_REPO: "",
  UPLOAD_GITHUB_USER: "",
  WINERY_ENDPOINT: "http://localhost:8080/winery",
};

// The DefinePlugin from webpack will be used to replace every occurrence of "process.env.<ENV_VAR>" with the configured value.
// First it will check if the env var was defined when run as a docker container. If not, it will check if it was defined during build time.
// If this was also not the case it will use the default value defined above.
for (let env_var_name in defaultConfig) {
  let docker_env_var = `window.env?.${env_var_name}`;

  let build_time_env_var = process.env[env_var_name];

  if (build_time_env_var) {
    build_time_env_var = JSON.stringify(build_time_env_var);
  }

  let default_env_var_value = JSON.stringify(defaultConfig[env_var_name]);

  defaultConfig[
    `process.env.${env_var_name}`
  ] = `(${docker_env_var} ?? ${build_time_env_var} ?? ${default_env_var_value})`;
  delete defaultConfig[env_var_name];
}

module.exports = {
  entry: {
    bundle: ["./modeler-component/QuantumWorkflowModeler.js"],
  },
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "public"),
  },
  devServer: {
    allowedHosts: "all",
  },
  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        resourceQuery: { not: [/raw/] },
        type: "asset/inline",
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/inline",
      },
      {
        test: /\.(less|css)$/i,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.bpmnlintrc$/i,
        use: "bpmnlint-loader",
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
            },
          },
          // 'css-loader',
        ],
      },
      {
        test: /\.bpmn$/,
        type: "asset/source",
      },
      {
        resourceQuery: /raw/,
        type: "asset/source",
      },
    ],
  },
  resolve: {
    extensions: [".jsx", ".js"],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "modeler-styles.css",
    }),
    // use the default values if environment variable does not exist
    new webpack.DefinePlugin(defaultConfig),
  ],
  mode: "development",
  devtool: "source-map",
};
