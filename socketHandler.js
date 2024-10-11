// socketHandler.js
const Player = require('./classesJeu/Player');

let players = []; // Tableau contenant tous les joueurs présents

function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        socket.on('joinGame', (pseudo) => {
            const newPlayer = new Player(pseudo, 1000);
            players.push(newPlayer);
            io.emit("recevoirJoueur", newPlayer); // Envoi d'un message à tous les clients

            // Gestion de la déconnexion des joueurs
            socket.on('disconnect', () => {
                console.log('A user disconnected');

                // Supprimer le joueur déconnecté
                players = players.filter(player => player !== newPlayer);
                io.emit("quitterJoueur", newPlayer);
            });
        });
    });
}

module.exports = socketHandler;
