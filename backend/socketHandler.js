const Player = require('./classesJeu/Player');
const PokerGame = require('./classesJeu/PokerGame'); // Vérifie cet import
const gameController = require('./Controllers/gameController');
const blinds = require('./utils/blind');
const playerController = require('./Controllers/playerController');
const Card = require("./classesJeu/Card");

var index_current_player = 0
let playerSockets = {}; // Associer chaque socket.id au joueur
var idQuiOntFold = [] ;
var idQuiARaise ; ;
// 0 si préflop, 1 : flop, 2 : Turn, 3 : River
var streetCourante = 0 ;
//Le "pot secondaire" càd le pot du tour actuel qui sera ajouté au pot global à la fin du tour
var potCourant = 0;
function getPlayers() {
    return gameController.getPlayers()
}

function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        socket.on('joinGame', (pseudo, id) => {
            try {
                // On vérifie si le pseudo du joueur n'est pas déjà autour de la table
                gameController.getPlayers().forEach((player) => {
                    if (player.getName === pseudo) {
                        throw new Error('Le joueur a déjà rejoint la partie.');
                    }
                });

                // On va chercher les coordonnées de là où sera placé le joueur en fonction du nb joueurs restant
                const [x, y] = playerController.findCoord(gameController.getPlayers());




                // Retourne la position réelle que va occuper le joueur rentrant lors de son 1er tour de table
                // (0 = BTN, 1 = SB, 2 = BB, 3 = HJ, 4 = LJ, 5 = CO)
                const p_reelle = playerController.findPositionReelle(gameController.getPlayers().length);

                // On donne au joueur l'id correspondant à son ID local
                const newPlayer = new Player(id, pseudo, 1000, x, y, p_reelle);

                // Associer le socket.id au joueur nouvellement créé
                playerSockets[socket.id] = newPlayer;

                gameController.gestionPartie(newPlayer, io);

            } catch (error) {
                console.error('Erreur :', error.message); // Affiche le message d'erreur
            }

            // Gestion de la déconnexion des joueurs
            socket.on('disconnect', () => {
                console.log('A user disconnected', socket.id);

                // Récupérer le joueur associé à ce socket.id
                const disconnectedPlayer = playerSockets[socket.id];

                // Supprimer le joueur déconnecté du tableau des joueurs
                gameController.setPlayers(gameController.getPlayers().filter(player => player !== disconnectedPlayer));

                // Enlever le joueur de la correspondance socket-joueur
                delete playerSockets[socket.id];


                // A chaque fois qu'un joueur se déconnecte, on réorganise la table en fonction du nb de joueurs restant
                gameController.getPlayers().forEach((player, index) => {
                    const [x, y] = playerController.findCoord2(index);

                    // On donne des nouvelles coordonnées au joueur
                    player.setX = x;
                    player.setY = y;
                    player.setPositionReelle = playerController.findPositionReelle(index);
                });

                // Informer les autres joueurs qu'un joueur a quitté la partie
                io.emit("quitterJoueur", disconnectedPlayer, gameController.getPlayers(), gameController.getPot());


                // Mettre à jour la liste des joueurs dans le jeu
                gameController.setPlayers(gameController.getPlayers());

                // Envoyer la liste des joueurs actuels à tous les clients
                const listeJoueursPartie = gameController.getPlayers();
                io.emit("listeJoueursPartie", listeJoueursPartie);
            });

            // Envoyer la liste des joueurs actuels à tous les clients
            const listeJoueursPartie = gameController.getPlayers();
            io.emit("listeJoueursPartie", listeJoueursPartie);
        });

        // Réception du socket émis par le front lors du clic sur le bouton
        socket.on('beginGame', () => {
            console.log("La partie va commencer");

            const amount_SB = 0.5;
            const amount_BB = 1;

            // SB et BB posent leurs blindes
            blinds.putBlinds(amount_SB, amount_BB, gameController.getPlayers(), gameController.getGame());

            // J'envoie au front la liste des joueurs et le nouveau pot
            io.emit("updatePot&Stack", gameController.getPlayers(), gameController.getPot());
        });

        // Fais changer les places réelles pour passer au tour suivant (btn devient SB etc.)
        socket.on('nextTour', () => {
            var players = gameController.getPlayers();

            potTourCourant = gameController.getPot()
            gameController.getGame().changeBlind(players);
            io.emit('updatePositionReelle', players, gameController.getPot());

            const amount_SB = 0.5;
            const amount_BB = 1;

            // SB et BB posent leurs blindes
            blinds.putBlinds(amount_SB, amount_BB, players, gameController.getGame());

            // Distribue 2 cartes à chaque joueur
            gameController.getGame().dealCards();

            // J'envoie au front la liste des joueurs et le nouveau pot
            io.emit("updatePot&Stack", gameController.getPlayers(), gameController.getPot());
        });

        socket.on('nextPlayer', async () => {
            console.log("JOUEUR SUIVANT :")
            const players = gameController.getPlayers();
            const players_id = players.map(player => player.id);
            
            console.log("playerss id : ", players_id)
            console.log("Pot Courant next Player : " , potCourant)
            //On envoie l'id du joueur qui doit jouer maintenant
            io.emit('tourJoueur',players_id[index_current_player],players[index_current_player].name,potCourant)
            
            
        });


        socket.on('tourTermine',(player_finish_play_id,data)=> {
            var playersListe = gameController.getPlayers();
            //On extrait les données 
            var {action, amount,allin} = data
            const playerActuel = playersListe.find(player => player.id === player_finish_play_id);   
              
            if(action == "fold") {
                //On ajoute l'id du joueur qui a fold dans le tableau des joueurs qui ont fold
                idQuiOntFold.push(player_finish_play_id)
                amount = 0
                console.log("Le joueur a passé son tour, il est donc exclu jusqu'à la prochaine main")
            }else if(action == "check") {
                amount=0
                console.log("Le joueur a check, il attend de voir les actions des autres joueurs") 
            }else if(action == "raise") {
                //Si tapis on mise tout le stack sinon juste la valeur choisie
                if(allin) {
                    amount = playerActuel.chips
                }else {
                    // Transformation du pourcentage entrée en montant réel
                    amount = gameController.getPot() * (amount)
                     }
                //Mise en place de la mise du joueurs   
                potCourant=amount
                console.log("nouveau pot courant : " , potCourant)
                gameController.getGame().bet(playerActuel,amount)
                console.log("Le joueur a decider de raise (miser) " , amount)
                idQuiARaise = player_finish_play_id

                // On envoie les nouvelles infos au front
                io.emit("updatePot&Stack", gameController.getPlayers(), gameController.getPot());
        
            }else if (action == "call") {
                console.log("NB CHIPS : ",playerActuel.getNbChips())
                //Si le joueur a assez de jeton pour call on le fait call sinon message
                if (playerActuel.getNbChips()>= potCourant) {
                    gameController.getGame().bet(playerActuel,potCourant)
                    console.log("Le joueur a call un montant de : ", potCourant)
                    potCourant = 0 
                    io.emit("updatePot&Stack", gameController.getPlayers(), gameController.getPot());
                    console.log("Passage à la prochaine street")
                }else {
                    console.log("Le joueur n'a pas assezz de jeton pour call ! Choisir une autre option")
                }
                
                // On envoie les nouvelles infos au front
                io.emit("updatePot&Stack", gameController.getPlayers(), gameController.getPot());
            }

            console.log("JOUEUR SUIVANT 2 :")
            index_current_player += 1
            console.log("Pour ce nouveau tour, voici l'index_current_player ", index_current_player)
            const players = gameController.getPlayers();
            var players_id ;
            // Si il y a un joueur qui a fold on l'exclu du prochain tour 
            if (idQuiOntFold != []) {

                players_id = players
                .filter(player => !idQuiOntFold.includes(player.id)) // Exclure les joueurs dont l'ID est dans idQuiOntFold 
                .map(player => player.id); // Extraire les ID restants
              
            //Sinon on ajoute tous les joueurs
            } else {
                players_id = players.map(player = player.id)
            }

            // Si il reste des joueurs qui doivent jouer 
            if (players_id.length >= index_current_player +1) 
                {
                console.log("Voici players_id pour ce tour : ", players_id)
                console.log("Joueur qui doit jouer mtnn ", players_id[index_current_player])
                //On envoie l'id du joueur qui doit jouer maintenant
                if (players_id[index_current_player] != idQuiARaise) {
                    io.emit('tourJoueur',players_id[index_current_player],players[index_current_player].name,potCourant)
                }else {
                    //Passage au prochain tour
                }
                    }
            else if (players_id != []) 
                //Si des joueurs n'ont pas fold au tour d'avant, on recommence au début du tableau pr les faire rejoeur
                //si il y a eu une mise
                {
                // Si il ne reste que un joueur ça veut dire que c'est le seul à ne pas avoir fold donc il gagne
                if (players_id.length == 1) {
                    const player_winner = players.find(player => player.id === players_id[0]);
                    console.log("Voici players_id pour ce tour : ", players_id)
                    console.log(player_winner.name, " a gagnée le coup")
                    potCourant = 0
                    console.log("passage à la prochaine street")
                    //On fait gagner le coup au joueur restant en lui donnant le pot
                    nbJetonsGagnes = gameController.winChips(player_winner)
                    io.emit("updatePot&Stack", gameController.getPlayers(), gameController.getPot())
                 }
                 //Sinon si il ne reste rien à call alors on passe au prochain tour
                else if (potCourant == 0) {
                    console.log("passage à la prochaine street")
                    potCourant = 0
                    index_current_player = 0
                //Sinon si il reste des joueurs qui doivent call alors on les fait jouer
                }else {
                    console.log("Des joueurs qui ne se sont pas couchés peuvent rejouer pour combler une mise")
                    index_current_player = 0
                    io.emit('tourJoueur',players_id[index_current_player],players[index_current_player].name,potCourant)

                }
              



            }
        })
    
    });

}

module.exports = {
    socketHandler,
    getPlayers
};
