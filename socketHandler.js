const Player = require('./classesJeu/Player');
const PokerGame = require('./classesJeu/PokerGame'); // Vérifie cet import
let players = []; // Tableau contenant tous les joueurs présents
let game = null;  // Variable pour stocker la partie

function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        socket.on('joinGame', (pseudo) => {
            // On crée un nouveau joueur après que le client ait rentré son pseudo


                    try {
                        // On vérifie si le pseudo du joueur n'est pas déjà autour de la table
                        for (var index_player in players) {
                            if (players[index_player].getName === pseudo) {
                                throw new Error('Le joueur a déjà rejoint la partie.');
                            }
                        }

                        const newPlayer = new Player(pseudo, 1000);
                        console.log(players.length);

                        // Si c'est le premier joueur à rejoindre, on crée une nouvelle partie
                        if (players.length === 0) {
                            players.push(newPlayer);
                            game = new PokerGame(players); // Initialiser la partie
                        } else {
                            players.push(newPlayer);
                            game.setPlayers(players); // Mettre à jour la liste des joueurs

                            // Envoi d'un message à tous les clients pour informer de l'arrivée d'un nouveau joueur
                            io.emit("recevoirJoueur", newPlayer);
                        }

                    // Affichage d'un message qui dit que l'on a déjà rejoint la partie
                    } catch (error) {
                        console.error(error.message); // Affiche le message d'erreur
                    }




            // Gestion de la déconnexion des joueurs
            socket.on('disconnect', () => {
                console.log('A user disconnected');

                // Supprimer le joueur déconnecté
                players = players.filter(player => player !== newPlayer);
                io.emit("quitterJoueur", newPlayer);

                // Mettre à jour la liste des joueurs dans le jeu
                game.setPlayers(players);

                // Envoyer la liste des joueurs actuels à tous les clients
                const listeJoueursPartie = game.getPlayers();
                io.emit("listeJoueursPartie", listeJoueursPartie);

            });
            // Envoyer la liste des joueurs actuels à tous les clients
            const listeJoueursPartie = game.getPlayers();
            io.emit("listeJoueursPartie", listeJoueursPartie);

        });
    });
}

module.exports = socketHandler;
