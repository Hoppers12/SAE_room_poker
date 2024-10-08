







const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user'); // Utilise le chemin relatif correct

const app = express();

// Middleware
app.use(cors());
app.use(express.json()); // Pour parser le corps des requêtes JSON

// Connexion à la base de données MongoDB
mongoose.connect('mongodb://localhost:27017/usersDB');

app.get('/', (req, res) => {
  res.json("Bienvenue dnas l\'API");
})

app.post('/users', async (req, res) => {
  const { name, email, password } = req.body;

  const newUser = new User({
    name,
    email,
    password,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
