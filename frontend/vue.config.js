const express = require('express');
const cors = require('cors');
const app = express();

module.exports = {
  devServer: {
    hot: true
  }
};

module.exports = {

};


// Active le middleware CORS avant les routes
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello Wdd!');
});




const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
