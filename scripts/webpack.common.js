const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: path.join(__dirname, "../src/index.js"),
  resolve: {
    alias: {
      sdk: path.join(__dirname, "../src/sdk"),
      config: path.join(__dirname, "../src/config"),
      utils: path.join(__dirname, "../src/utils"),
      consts: path.join(__dirname, "../src/consts"),
      components: path.join(__dirname, "../src/components"),
      assets: path.join(__dirname, "../assets")
    }
  },
  output: {
    filename: "bundle.min.js",
    path: path.join(__dirname, "../dist/"),
    clean: true
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"]
          }
        }
      },
      {
        test: /\.(gif|png|jpe?g|svg|mp3|m4a|ogg|wav|json|glb|gltf$)$/i,
        type: "asset/inline"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, "../src/index.html")
    })
  ]
};
