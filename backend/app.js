const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./Models/user');
const Bet = require('./Models/bet')
const Sport = require('./Models/sports')
const Team = require('./Models/team')
const Players = require('./Models/player')
const BetUser = require('./Models/bet_user');
const {createServer} = require('./server');
const bcrypt = require('bcrypt');
require('./scheduler');




const {join} = require("node:path");
const app = express();

app.use(cors());
app.use(express.json());


mongoose.connect('mongodb://bdd:27017/usersDB');
app.get('/api/matches', async (req,res)=>{
  try{
    const matches = await Match.find();
    res.json(matches);
  } catch(err){
    res.status(500).json({error : err.message});
  }
})



app.get('/api/betUser', async (req, res) => {
    try {
        const betUsers = await BetUser.find();
        res.json(betUsers);
    } catch (error) {
        console.error('Erreur lors de la récupération des paris utilisateur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

app.get('/api/hashedPassword/:email/:password', async (req, res) => {
    try {
        const { email, password } = req.params;
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            return res.status(200).json({message: 'True'});
        } else {
            return res.status(401).json({message: 'False'});
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});


app.get('/api/betUser/:id', async (req, res) => {
    try {
        const betUserId = req.params.id;
        const betUser = await BetUser.find({ userId: betUserId });
        if (!betUser) {
        return res.status(404).json({ message: 'Pari utilisateur non trouvé' });
        }
        res.json(betUser);
    } catch (error) {
        console.error('Erreur lors de la recherche du pari utilisateur:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.delete('/api/betUser/:id', async (req, res) => {
    try {
        const betUserId = req.params.id;
        const result = await BetUser.findByIdAndDelete(betUserId);
        if (!result) {
        return res.status(404).json({ message: 'Pari utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Pari utilisateur supprimé avec succès' });
    } catch (error) {
        console.error('Erreur lors de la suppression du pari utilisateur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

app.put('/api/betUser/:id', async (req, res) => {
    try {
        const betUserId = req.params.id;
        const updateData = req.body;
        const options = { new: true, runValidators: true };
        const result = await BetUser.findByIdAndUpdate(betUserId, updateData, options);
        if (!result) {
        return res.status(404).json({ message: 'Pari utilisateur non trouvé' });
        }
        res.status(200).json({ message: 'Pari utilisateur modifié avec succès' });
    } catch (error) {
        console.error('Erreur lors de la modification du pari utilisateur:', error);
        res.status(500).json({ message: 'Erreur interne du serveur' });
    }
});

app.post('/api/betUser', async (req, res) => {
  try {
    const { userId, bets, stake, totalOdds } = req.body;
    const potentialGain = (stake * totalOdds).toFixed(2);
    const newBetUser = new BetUser({
      userId,
      bets,
      stake,
      totalOdds,
      potentialGain,
    });
    const savedBetUser = await newBetUser.save();
    res.status(201).json(savedBetUser);
  } catch (error) {
    console.error('Erreur lors de la création du pari utilisateur:', error);
    res.status(500).json({ message: 'Erreur interne du serveur' });
  }
});
app.get('/api/sports', async (req,res) =>{
  try{
    const sports = await Sport.find();
    res.json(sports)
  } catch (err){
    res.status(500).json({error: err.message})
  }
})

app.get('/', (req, res) => {
  res.json("Bienvenue dans l\'API");
})


app.get('/api/players',async (req, res) => {
  try {
    const players = await Players.find();
    res.json(players);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
})

app.get('/api/bets',async (req, res) => {
  try {
    const bets = await Bet.find().populate('team').populate('sport').populate('matches').exec();
    res.json(bets);
  } catch (err) {
    res.status(500).json({error: err.message});
  }
})





app.get('/api/teams',async (req,res)=>{
  try{
    const Teams = await Team.find();
    res.json(Teams)
  } catch(err){
    res.status(500).json({error : err.message})
  }
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


app.delete('/api/bets/:id', async (req, res) => {
  try {
    const betId = req.params.id;
    const result = await Bet.findByIdAndDelete(betId);
    if (!result) {
      return res.status(404).json({message: 'Pari non trouvé'});
    }
    res.status(200).json({message: 'Pari supprimé avec succès'});
  } catch (error) {
    console.error('Erreur lors de la suppression du pari:', error);
    res.status(500).json({message: 'Erreur interne du serveur'});
  }
})



app.post('/api/users', async (req, res) => {
  const { firstname,name,birthdate,city,address,postCode,nationality,phone,pseudo, email, password,isAdmin } = req.body;
  const saltRounds = 10;
  const hashedpassword = await bcrypt.hash(password, saltRounds);
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
    password : hashedpassword,
    isAdmin,
  });

  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/matches', async (req, res) => {

  const { home_team,away_team,match_name,result,id_sport,match_date,odds } = req.body;
  const newMatch = new Match({
    home_team,
    away_team,
    match_name,
    result,
    id_sport,
    match_date,
    odds
  });
  try {
    const savedMatch = await newMatch.save();
    res.status(201).json(savedMatch);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }

});

app.get('/api/matches/:id', async (req, res) => {
    try {
        const matchId = req.params.id;
        const match = await Match.findById(matchId);
        if (!match) {
            return res.status(404).json({ message: 'Match non trouvé' });
        }
        res.json(match);
    } catch (error) {
        console.error('Erreur lors de la recherche du match:', error);
        res.status(500).json({ message: 'Erreur serveur' });
    }
});

app.post('/api/bets', async (req, res) => {
  const { bet_date,team,bet_result,sport,matches} = req.body;
  const newBet = new Bet({
    bet_date,
    team,
    bet_result,
    sport,
    matches,
  });

  try {
    const savedBet = await newBet.save();
    res.status(201).json(savedBet);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/bets/:id', async (req, res) => {
  try {
    const betId = req.params.id;
    const bet = await Bet.findById(betId);
    if (!bet) {
      return res.status(404).json({ message: 'Pari non trouvé' });
    }
    res.json(bet);
  } catch (error) {
    console.error('Erreur lors de la recherche du pari:', error);
    res.status(500).json({ message: 'Erreur serveur' });
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


app.put('/api/bets/:id', async (req, res) => {
  try {
    const betId = req.params.id;
    const updateData = req.body;
    const options = { new: true, runValidators: true };
    const result = await Bet.findByIdAndUpdate(betId,updateData,options);
    if (!result) {
      return res.status(404).json({message: 'Pari non trouvé'});
    }
    res.status(200).json({message: 'Pari supprimé avec succès'});
  } catch (error) {
    console.error('Erreur lors de la suppression du Pari:', error);
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

const {socketHandler,getPlayers}
    = require('./socketHandler');

socketHandler(io);

const Match = require("./Models/match");
createServer();