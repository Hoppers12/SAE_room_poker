// server.js

const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const socketHandler = require('./socketHandler');

//Fonction qui crée le serveur de socket
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
        transports: ['websocket'] // Utiliser le transport WebSocket
    });

    // Activer CORS pour toutes les requêtes
    app.use(cors());

    // Appel du fichier qui gère les sockets
    socketHandler(io);

    // Route d'accueil
    app.get('/', (req, res) => {
        res.json("Bienvenue dans le serveur");
    });

    // Démarrer le serveur
    const PORT = 5000;
    server.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    });

    return server;
}

module.exports ={ createServer } ;
