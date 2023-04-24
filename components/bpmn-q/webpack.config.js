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
        type: 'asset/resource',
        generator: {
          filename: 'images/[name][hash][ext]'
        }
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][hash][ext]'
        }
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
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
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
    })
  ],
  mode: 'development',
  devtool: 'source-map'
};