const express = require('express');
const path = require('path');
const app = express();

// Servir les fichiers statiques du frontend
app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req, res) => {
  res.s(path.join(__dirname, 'frontend/dist/index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
