const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// const prefixCss = require('prefix-css-loader');
// const PostCSSPrefix = require('postcss-prefix-webpack');
const path = require('path');

module.exports = {
  entry: {
    bundle: ['./modeler-component/QuantumWorkflowModeler.js']
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'public'),
    // publicPath: '/',
  },

  module: {
    rules: [
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: 'asset/inline',
        //generator: {
        //  filename: 'images/[name][hash][ext]'
        //}
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[name][hash][ext]'
        }
      },
      {
        test: /\.(less|css)$/i,
        use: [
          // compiles Less to CSS
          // "style-loader",
          // MiniCssExtractPlugin.loader,
          "css-loader",
          "less-loader",
        ],
      },
      // {
      //   test: /\.css$/i,
      //   use: [
      //     // 'style-loader',
      //     // MiniCssExtractPlugin.loader,
      //     'css-loader',
      //     // {
      //     //   // CSS to CommonJS (resolves CSS imports into exported CSS strings)
      //     //   loader: 'css-loader',
      //     //   options: {
      //     //     sourceMap: true,
      //     //     importLoaders: 2
      //     //     // url: false,
      //     //     // import: false
      //     //   }
      //     // },
      //     // {
      //     //   loader: 'postcss-loader',
      //     //   options: {
      //     //     // postcssOptions: {
      //     //     //   ctx: {
      //     //     //     cssnext: {},
      //     //     //     cssnano: {},
      //     //     //     autoprefixer: {}
      //     //     //   }
      //     //     // },
      //     //     sourceMap: true
      //     //   }
      //     // },
      //     // {
      //     //   loader: 'resolve-url-loader',
      //     //   options: {
      //     //     attempts: 1,
      //     //     sourceMap: true
      //     //   }
      //     // },
      //     // 'postcss-loader',
      //     // {
      //     //   loader: 'prefix-css-loader',
      //     //   options: {
      //     //     selector: '.quantum-workflow-modeler',
      //     //     // exclude: null,
      //     //     // minify: false
      //     //   }
      //     // }
      //     // {
      //     //   loader: 'postcss-loader',
      //     //   options: {
      //     //     // plugins: [
      //     //     //   'autoprefixer',
      //     //     // ]
      //     //     postcssOptions: {
      //     //       plugins: {
      //     //         "postcss-prefix-selector": {
      //     //           prefix: '.qwm',
      //     //           transform(prefix, selector, prefixedSelector, filePath, rule) {
      //     //             if (selector.match(/^(html|body)/)) {
      //     //               return selector.replace(/^([^\s]*)/, `$1 ${prefix}`);
      //     //             }
      //     //
      //     //             if (filePath.match(/node_modules/)) {
      //     //               return selector; // Do not prefix styles imported from node_modules
      //     //             }
      //     //
      //     //             const annotation = rule.prev();
      //     //             if (annotation?.type === 'comment' && annotation.text.trim() === 'no-prefix') {
      //     //               return selector; // Do not prefix style rules that are preceded by: /* no-prefix */
      //     //             }
      //     //
      //     //             return prefixedSelector;
      //     //           },
      //     //         },
      //     //         autoprefixer: {
      //     //           overrideBrowserslist: ['last 4 versions']
      //     //         }
      //     //       }
      //     //     }
      //     //   }
      //     // },
      //   ],
      // },
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
  ],
  mode: 'development',
  devtool: 'source-map',
};
