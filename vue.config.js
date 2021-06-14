module.exports = {
  assetsDir: 'static',
  css: {
    sourceMap: true,
  },
  pluginOptions: {
    apollo: {
      lintGQL: true,
    },
  },
  devServer: {
    proxy: {
      '^/(admin|api|static)': {
        target: 'http://localhost:8000',
      },
    },
  },
};
