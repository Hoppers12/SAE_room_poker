module.exports = {
  devServer: {
    port: 8000,
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/': '' },
      },
    },
    hot: true,
  },
};
