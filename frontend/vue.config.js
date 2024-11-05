module.exports = {
  devServer: {
    hot: true,
    port: 8000,
    host: 'frontend',
    proxy: {
      '/api1': {
        target: 'http://backend:5000',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/api1': '' },
      },
      '/api': {
        target: 'http://backend:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
};
