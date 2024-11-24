const { merge } = require("webpack-merge");
const common = require("./webpack.common.js");
const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");
const HtmlInlineScriptPlugin = require("html-inline-script-webpack-plugin");

module.exports = merge(common, {
  mode: "production",
  stats: "errors-only",
  optimization: {
    usedExports: true,
    minimize: true,
    minimizer: [
      new TerserPlugin({
        extractComments: false,
        terserOptions: {
          safari10: true,
          compress: {
            drop_console: true,
            arrows: false
          },
          output: {
            comments: false,
            quote_style: 3
          }
        }
      })
    ]
  },
  plugins: [
    new HtmlInlineScriptPlugin(),

    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true),
      __DEV__: JSON.stringify(false)
    })
  ]
});
