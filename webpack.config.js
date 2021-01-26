const fs = require("fs");
const path = require("path");
const webpack = require("webpack");

module.exports = {
  mode: "production",
  entry: "./src/index.js",
  target: "web",
  output: {
    filename: "npu.user.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: "",
  },
  optimization: {
    minimize: false,
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: () => {
        const version = JSON.parse(fs.readFileSync(path.join(__dirname, "package.json"), "utf8")).version;
        if (typeof version !== "string" || !/^\d+\.\d+\.\d+$/.exec(version)) {
          throw new Error(`Invalid package version: ${version}`);
        }
        const meta = fs.readFileSync(path.join(__dirname, "src", "meta.txt"), "utf8");
        return meta.replace("<version>", version);
      },
      entryOnly: true,
      raw: true,
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif|svg|ico)$/,
        use: "url-loader",
      },
      {
        test: /\.scss$/,
        use: [
          "extract-loader",
          "css-loader",
          "sass-loader",
        ],
      },
    ],
  },
};
