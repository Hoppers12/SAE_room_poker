module.exports = {
  devServer: {
    hot: true,
    port: 8000,
    proxy: {
      '/': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: { '^/': '' },
      },
    },
  },
};
