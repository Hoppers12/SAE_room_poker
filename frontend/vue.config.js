module.exports = {
  devServer: {
    port: 8000,
    proxy: {
      '/': {
        target: 'http://backend:3000',
        changeOrigin: true,
        pathRewrite: { '^/': '' },
      },
    },
    hot: true,
  },
};
