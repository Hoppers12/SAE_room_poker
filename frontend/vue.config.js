module.exports = {
  devServer: {
    port: 8000,
    host:'localhost',
    proxy: {
      '/': {
        target: 'http://localhost:5000',
        ws: true, // Important pour WebSockets
        changeOrigin: true,
        pathRewrite: { '^/': '' },
      },
    },
    hot: true,
  },
};
