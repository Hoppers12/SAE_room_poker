const express = require('express');
const cors = require('cors');
const app = express();

// Active le middleware CORS avant les routes
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
