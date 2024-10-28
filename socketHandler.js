const Player = require('./classesJeu/Player');
const PokerGame = require('./classesJeu/PokerGame'); // Vérifie cet import
let players = []; // Tableau contenant tous les joueurs présents
let game = null;  // Variable pour stocker la partie
let playerSockets = {}; // Associer chaque socket.id au joueur


//Fonction qui crée la partie ou appelle la fonction qui ajoute le joueur a une partie deja existante
function gestionPartie(newPlayer,io)
{
    // Si c'est le premier joueur à rejoindre, on crée une nouvelle partie
    if (players.length === 0)
    {
        players.push(newPlayer);
        game = new PokerGame(players); // Initialiser la partie
        game.setPlayers(players); // Mettre à jour la liste des joueurs
        var NbPlayer = getNbPlayers();
        // Envoi d'un message à tous les clients pour informer de l'arrivée d'un nouveau joueur
        io.emit("recevoirJoueur", newPlayer,players);
    }
    else
    {
        ajoutNouveauJoueurDansPartie(newPlayer,io)
    }
}

// Fonction qui retourne les coordonnées de l'emplacement à utiliser en fonction du nb de joueurs autour de la table
function findCoord(players) {
    console.log('FindCoord appelé')
    var NbPlayer = players.length;
    let x, y;

    switch (NbPlayer+1) {
        case 1:
            x = 100;
            y = 100;
            break;
        case 2:
            x = 400;
            y = 35;
            break;
        case 3:
            x = 700;
            y = 100;
            break;
        case 4:
            x = 100;
            y = 500;
            break;
        case 5:
            x = 400;
            y = 560;
            break;
        case 6:
            x = 700;
            y = 500;
            break;
        default:
            console.log("nb joueurs non valide");
            return null;
    }

    return [x, y]; // Return x and y as an array
}



function ajoutNouveauJoueurDansPartie(newPlayer,io)
{
    players.push(newPlayer);
    game.setPlayers(players); // Mettre à jour la liste des joueurs
    var NbPlayer = getNbPlayers();

    // Envoi d'un message à tous les clients pour informer de l'arrivée d'un nouveau joueur
    io.emit("recevoirJoueur", newPlayer,players);
}

function findCoord2(taille) {
    let x, y;

    switch (taille+1) {
        case 1:
            x = 100;
            y = 100;
            break;
        case 2:
            x = 400;
            y = 35;
            break;
        case 3:
            x = 700;
            y = 100;
            break;
        case 4:
            x = 100;
            y = 500;
            break;
        case 5:
            x = 400;
            y = 560;
            break;
        case 6:
            x = 700;
            y = 500;
            break;
        default:
            console.log("nb joueurs non valide");
            return null;
    }

    return [x, y]; // Return x and y as an array
}

function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        socket.on('joinGame', (pseudo) => {
            // On crée un nouveau joueur après que le client ait rentré son pseudo


                    try
                    {
                        // On vérifie si le pseudo du joueur n'est pas déjà autour de la table
                        for (var index_player in players) {
                            if (players[index_player].getName === pseudo) {
                                throw new Error('Le joueur a déjà rejoint la partie.');
                            }
                        }
                        // On va chercher les coordonnées de là où sera placé le joueur en fonction du nb joueurs restant
                        const [x,y] = findCoord(players);
                        const newPlayer = new Player(pseudo, 1000,x,y);

                        // Associer le socket.id au joueur nouvellement créé
                        playerSockets[socket.id] = newPlayer;
                        console.log(players.length);

                        gestionPartie(newPlayer,io) ;


                    // Affichage d'un message qui dit que l'on a déjà rejoint la partie
                    } catch (error)
                    {
                        console.error(error.message); // Affiche le message d'erreur
                    }




            // Gestion de la déconnexion des joueurs
            socket.on('disconnect', () => {
                console.log('A user disconnected', socket.id);

                // Récupérer le joueur associé à ce socket.id
                const disconnectedPlayer = playerSockets[socket.id];

                // Supprimer le joueur déconnecté du tableau des joueurs
                players = players.filter(player => player !== disconnectedPlayer);
                // Enlever le joueur de la correspondance socket-joueur
                delete playerSockets[socket.id];


                players.forEach((player,index) => {
                    const [x,y]= findCoord2(index)

                    player.setX = x;
                    player.setY = y ;
                });

                // Informer les autres joueurs qu'un joueur a quitté la partie
                io.emit("quitterJoueur", disconnectedPlayer,players);
                console.log(players);
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

function getPlayers() {
    return players;
}

function getNbPlayers() {
    return players.length;
}

module.exports = {
    socketHandler,
    getPlayers
};
