const TsconfigPathsPlugin = require("tsconfig-paths-webpack-plugin");

module.exports = {
  // Other webpack configuration options...
  resolve: {
    plugins: [new TsconfigPathsPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
};
