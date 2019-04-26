module.exports = {
  pages: {
    index: {
      entry: "example/main.js",
      template: "example/index.html",
      filename: "index.html"
    }
  },
  css: { extract: false },
  productionSourceMap: false,
  chainWebpack: config => {
    config.module
      .rule("js")
      .include.add("/packages")
      .end()
      .use("babel")
      .loader("babel-loader")
      .tap(options => {
        return options;
      });
  }
};
