const path = require("path");
const isProduction = process.env.NODE_ENV == "production";
const webpack = require("webpack");
const glob = require("glob");
const webpackNodeExternals = require("webpack-node-externals");
const getEntries = (matches) => {
  return glob.sync("./src/**/" + matches).reduce((acc, file) => {
    acc[file.replace(/^\.\/src\//, "").replace(/\.ts$/, "")] = file;
    return acc;
  }, {});
};
const getModules = () => getEntries("*.{command.ts,event.ts}");

/**
 * @type {import("webpack").Configuration} config
 */
const config = {
  entry: () => {
    return { app: path.resolve(__dirname, "src/app.ts"), ...getModules() };
  },
  target: "node",
  devtool: "inline-source-map",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
    pathinfo: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.NODE_ENV": isProduction ? "production" : "development",
      __DEV__: !isProduction,
    }),
  ],
  externals: [webpackNodeExternals()],
  module: {
    rules: [
      {
        test: /\.(tsx?)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src/"),
    },
    extensions: [".tsx", ".ts", ".js"],
  },
};

module.exports = () => {
  if (isProduction) {
    config.mode = "production";
  } else {
    config.mode = "development";
  }
  return config;
};
