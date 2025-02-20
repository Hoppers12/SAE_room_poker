const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { socketHandler, getPlayers } = require('./socketHandler');

// Données simulées pour les parties de poker
let games = [
    {
        id: 1,
        communityCards: [],
        pot: 0,
        currentPlayerIndex: 0,
        dealerIndex: 0,
        players: []
    },
    {
        id: 2,
        communityCards: [],
        pot: 0,
        currentPlayerIndex: 0,
        dealerIndex: 0,
        players: []
    },
    {
        id: 3,
        communityCards: [],
        pot: 0,
        currentPlayerIndex: 0,
        dealerIndex: 0,
        players: []
    }
];

// Fonction qui crée le serveur de socket
function createServer() {
    const app = express();
    const server = http.createServer(app);

    // Configuration de Socket.io avec CORS
    const io = socketIo(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST'],
            allowedHeaders: ['my-custom-header'],
            credentials: true
        },
        transports: ['websocket']
    });

    // Activer CORS pour toutes les requêtes
    app.use(cors());
    app.use(express.json());

    // Appel du fichier qui gère les sockets
    socketHandler(io);

    // Route d'accueil
    app.get('/', (req, res) => {
        res.json("Bienvenue dans le serveur");
    });

    // Route pour récupérer toutes les parties de poker
    app.get('/api/games', (req, res) => {
        res.json(games);
    });
    app.get('/api/games/:id', (req, res) => {
        const gameId = parseInt(req.params.id, 10); // Convertir en nombre
    
        const game = games.find(g => g.id === gameId);
    
        if (!game) {
            return res.status(404).json({ error: "Partie non trouvée" });
        }
    
        res.json(game);
    });

    // Route pour ajouter des joueurs à une partie
    // Route pour ajouter des joueurs à une partie
    app.patch('/api/games/:id/players', (req, res) => {
        const gameId = parseInt(req.params.id, 10);
        const { players } = req.body;
    
        const game = games.find(g => g.id === gameId);
        if (!game) {
            return res.status(404).json({ error: "Partie non trouvée" });
        }
    
        if (!Array.isArray(players)) {
            return res.status(400).json({ error: "Le format des joueurs est invalide" });
        }
    
        // Ajouter uniquement les nouveaux joueurs qui ne sont pas déjà dans la partie
        players.forEach(player => {
            if (!game.players.some(p => p.name === player.name)) {
                game.players.push(player);
            }
        });
    
        res.json({ message: "Joueurs ajoutés", game });
    });

    
    //récupérer tous les joueurs d'une partie
    app.get('/api/games/:id/players', (req, res) => {
        const gameId = parseInt(req.params.id, 10);
    
        const game = games.find(g => g.id === gameId);
        if (!game) {
            return res.status(404).json({ error: "Partie non trouvée" });
        }
    
        joueurs = game.players
        res.json({ joueurs });
    });


       // Route pour supprimer tous les joueurs d'une partie
       app.delete('/api/games/:id/players', (req, res) => {
        const gameId = parseInt(req.params.id, 10);
    
        const game = games.find(g => g.id === gameId);
        if (!game) {
            return res.status(404).json({ error: "Partie non trouvée" });
        }
    
        game.players = [];
        res.json({ message: "Tous les joueurs ont été supprimés", game });
    });

    // Démarrer le serveur
    const PORT = 5000;
    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });

    return server;
}

module.exports = { createServer };
