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
  pages: {
    index: {
      entry: 'src/main.ts',
      title: 'Tumpara',
    },
  },
  devServer: {
    host: '127.0.0.1',
    proxy: {
      '^/(admin|api|static)': {
        target: 'http://localhost:8000',
      },
    },
  },
};
