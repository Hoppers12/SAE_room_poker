module.exports = {
  devServer: {
    hot: true,
    port: 8000,
    host: 'localhost',
    proxy: {
      '/': {
        target: 'http://localhost:5000',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/api1': '' },
      },
      '/api': {
        target: 'http://localhost:3000',
        ws: true,
        changeOrigin: true,
        pathRewrite: { '^/api2': '' },
      },
    },
  },
};
