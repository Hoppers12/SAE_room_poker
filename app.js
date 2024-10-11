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

app.delete('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const result = await User.findByIdAndDelete(userId);
    if (!result) {
      return res.status(404).json({message: 'Utilisateur non trouvé'});
    }
    res.status(200).json({message: 'Utilisateur supprimé avec succès'});
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({message: 'Erreur interne du serveur'});
  }
})

app.post('/api/users', async (req, res) => {
  const { id,firstname,name,birthdate,city,address,postCode,nationality,phone,pseudo, email, password,isAdmin } = req.body;
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
    isAdmin,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put('/api/users/:id', async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    const options = { new: true, runValidators: true };
    const result = await User.findByIdAndUpdate(userId,updateData,options);
    if (!result) {
      return res.status(404).json({message: 'Utilisateur non trouvé'});
    }
    res.status(200).json({message: 'Utilisateur supprimé avec succès'});
  } catch (error) {
    console.error('Erreur lors de la suppression de l\'utilisateur:', error);
    res.status(500).json({message: 'Erreur interne du serveur'});
  }
})

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



const express2 = require('express');
const cors2 = require('cors'); // Import CORS
const http = require('http');
const socketIo = require('socket.io');
const Player = require('./classesJeu/Player');


const app2 = express();
const server = http.createServer(app2);


const io = socketIo(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['my-custom-header'],
    credentials: true
  },
  transports: ['websocket']
});


app.use(cors());

const socketHandler
    = require('./socketHandler');
socketHandler(io);

const { createServer } = require('./server');
createServer();