const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/user');
const {join} = require("node:path");
const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/usersDB');

app.get('/', (req, res) => {
  res.json("Bienvenue dans l\'API");
})

app.post('/api/users', async (req, res) => {
  const { id,firstname,name,birthdate,city,address,postCode,nationality,phone,pseudo, email, password } = req.body;
  const newUser = new User({
    firstname,
    name,
    birthdate,
    city,
    address,
    postCode,
    nationality,
    phone,
    pseudo,
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

app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (error) {
    console.error('Erreur lors de la recherche de l\'utilisateur:', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

app.use(express.static(join(__dirname, '/frontend/dist')));

app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '/frontend/dist', 'index.html'));
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});