const express = require('express');
const path = require('path');
const app = express();

module.exports = {
  devServer: {
    hot: true
  }
};


app.use(express.static(path.join(__dirname, 'frontend/dist')));


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
