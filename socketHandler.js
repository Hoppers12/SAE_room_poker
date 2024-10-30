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
        io.emit("recevoirJoueur", newPlayer,players,game.pot);

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
    console.log("GAME : ", game);
    // Envoi d'un message à tous les clients pour informer de l'arrivée d'un nouveau joueur
    io.emit("recevoirJoueur", newPlayer,players);
}


//Permet de donner de nouvelle coordonnées directement en fonction d'une taille et pas d'un tableau
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

//Retourne l'indice de la position du joueur dans la partie (0 = BTN, 1 = SB, 2 = BB, 3 = HJ, 4 = LJ, 5 = CO)
function findPositionReelle(nbJoueurs)
{

    // Le nouveau joueur rentre le plus à droite possible donc équivalent au nb de joueurs déjà présent
    return nbJoueurs ;

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

                        // Retourne la position réelle que va occuper le joueur rentrant lors de son 1er tour de table
                        // (0 = BTN, 1 = SB, 2 = BB, 3 = HJ, 4 = LJ, 5 = CO)
                        const p_reelle = findPositionReelle(players.length)

                        const newPlayer = new Player(pseudo, 1000,x,y,p_reelle);

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


                //A chaque fois qu'un joueur se deconnecte, on rééorganise la table en fonction du nb de joueurs restant
                players.forEach((player,index) => {
                    const [x,y]= findCoord2(index)
                    //On donne des nouvelles coordonnées au joueur
                    player.setX = x;
                    player.setY = y ;
                    player.setPositionReelle = findPositionReelle(index)
                });

                // Informer les autres joueurs qu'un joueur a quitté la partie
                io.emit("quitterJoueur", disconnectedPlayer,players,game.pot);
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

        //Reception du socket émit par le front lors du click sur le bouton
        socket.on('beginGame', () => {
            console.log("La partie va commencer")
            const nbPlayers = players.length
            const amount_SB = 0.5
            const amount_BB = 1

            // SB et BB posent leurs blindes
            players.forEach((player) => {

                console.log(player.name , player.p_reelle)
                if (player.p_reelle === 1) {
                    game.bet(player,amount_SB)


                }// Sil y a que 2 joueurs le BTN pose la BB
                else if (player.p_reelle === 2 || (player.p_reelle === 0 && nbPlayers === 2))
                {
                    game.bet(player,amount_BB)
                }
                console.log('Le pot est de : ' , game.getPot())
                //J'envoie au front la liste des joueurs et le nouveau pot
                io.emit("updatePot&Stack",players,game.getPot())
            })
        })
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
