const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { socketHandler, getPlayers } = require('./socketHandler');

let games = {}; // Stocke les parties

// Fonction qui crée 3 parties au démarrage
function createPredefinedGames(io) {
    const predefinedGames = [
        { id: "0", name: "PARTIE 1", players: [], pot: 0 },
        { id: "1", name: "PARTIE 2", players: [], pot: 0 },
        { id: "2", name: "PARTIE 3", players: [], pot: 0 }
    ];

    predefinedGames.forEach(game => {
        games[game.id] = game;
    });

    console.log("Trois parties créées au démarrage:", Object.values(games));

    // Envoyer les parties aux joueurs connectés
    io.emit("update-lobby", Object.values(games));
}

// Fonction qui crée le serveur de socket
function createServer() {
    const app = express();
    const server = http.createServer(app);

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

    // Gestion des sockets
    socketHandler(io, games);

    // Créer les parties préexistantes
    createPredefinedGames(io);

    // Route d'accueil
    app.get('/', (req, res) => {
        res.json("Bienvenue dans le serveur");
    });

    // Route pour récupérer les parties existantes
    app.get('/games', (req, res) => {
        res.json(Object.values(games));
    });

    // Démarrer le serveur
    const PORT = 5000;
    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });

    return server;
}

//redirige vers /game/id
function joinGame(gameId) {
    this.$router.push({ name: "Game", params: { id: gameId } });
  }

module.exports = { createServer,joinGame };
