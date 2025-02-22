const Player = require('./classesJeu/Player');
const PokerGame = require('./classesJeu/PokerGame'); // Vérifie cet import
const gameController = require('./Controllers/gameController');
const blinds = require('./utils/blind');
const playerController = require('./Controllers/playerController');
const Card = require("./classesJeu/Card");


var index_current_player = 0
let playerSockets = {}; // Associer chaque socket.id au joueurs
var idQuiOntFold = [] ;
var idQuiARaise ; 
// 0 si préflop, 1 : flop, 2 : Turn, 3 : River
var streetCourante = 0 ;
//Le "pot secondaire" càd le pot du tour actuel qui sera ajouté au pot global à la fin du tour
var potCourant = 0;
var winner = null;
function getPlayers() {
    return gameController.getPlayers()
}

//Fais les modifications nécessaires pour passer à la prochaien street (Afficage des cartes communes)
//Remise du pot courant à 0
function passageALaProchaineStreet (io, gameController) {
    console.log("Passage à la prochaine street ")
    streetCourante += 1
    io.emit("nouvelleStreet",streetCourante)
    //On ajoute les nouvelles cartes communes
    console.log("Street Courantes : " , streetCourante)
    sharedCards = gameController.printSharedCards(streetCourante)
    console.log("Cartes communes : " , sharedCards)
    io.emit("cartesCommunes",sharedCards)
    potCourant = 0
}

function socketHandler(io) {

    io.on('connection', (socket) => {
        console.log('A user connectedd', socket.id);

        socket.on('joinGame', (pseudo, id) => {
            try {
                streetCourante = 0
                // On vérifie si le pseudo du joueur n'est pas déjà autour de la table
                gameController.getPlayers().forEach((player) => {
                    if (player.getName === pseudo) {
                        throw new Error('Le joueur a déjàa rejoint la partie.');
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
            if (players[index_current_player] != undefined) {
                io.emit('tourJoueur',players_id[index_current_player],players[index_current_player].name,potCourant)
            }

            
            
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
                nbJetonsJoueurActuel = playerActuel.getNbChips()
                console.log("NB CHIPS : ",nbJetonsJoueurActuel)
                //Si le joueur a assez de jeton pour call  on le fait call et prochaine street sinon message
                if (nbJetonsJoueurActuel >= potCourant) {
                    gameController.getGame().bet(playerActuel,potCourant)
                    console.log("Le joueur a call un montant de : ", potCourant)
                    potCourant = 0 
                }else {
                    //Le joueur part à tapis directement si il n'a pas le montant requis
                    console.log("Le joueur n'a pas assezz de jeton pour call ! Il part donc à tapis directement")
                    gameController.getGame().bet(playerActuel,nbJetonsJoueurActuel)
                    potCourant += nbJetonsJoueurActuel
                    //En fonction de street courante on passe plus ou moins de fois à la prochaine street
                    switch (streetCourante) {
                        case 0 : 
                            passageALaProchaineStreet(io,gameController)
                            passageALaProchaineStreet(io,gameController)
                            passageALaProchaineStreet(io,gameController)
                            break;
                        case 1:
                            passageALaProchaineStreet(io,gameController)
                            passageALaProchaineStreet(io,gameController)
                            break;
                        case 2:
                            passageALaProchaineStreet(io,gameController)
                            break;
                        default:
                            console.log(`Pas de passage à la prochaine street nécessaie`);
                    }
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
                    //Si on est deja à la river on determine le gagnant
                    if(streetCourante == 3) {
                        player1 = gameController.getPlayers()[0]
                        player2 = gameController.getPlayers()[1]
                        console.log("Player 1 name", player1.getName,"Player 1 namee", player2.getName)
                        result = gameController.getGame().getWinner(player1,player2,sharedCards)
                        console.log(result.player1.name," a : ",result.player1.combination, result.player2.name," a : ", result.player2.combination, result.winner, " a donc remporté le coup avec : " , result.winningCombination )
                    
                        //On fait gagner le coup au joueur restant en lui donnant le pot
                        if (result.winner == "Player 1") {
                            winnerName = result.player1.name
                        }else if (result.winner == "Player 2") {
                            winnerName = result.player2.name
                        }else {
                            console.log("Egalité, partage du pot")
                            winnerName = "Egalité"
                        }
                        //On va chercher l'attribut du player gagnant en fonction du pseudo retourné
                        gameController.getPlayers().forEach(player => {
                            if (player.getName === winnerName) {
                                playerWinner = player;  // On assigne le joueur correspondant à playerWinner
                            }
                        });

                        nbJetonsGagnes = gameController.winChips(playerWinner)
                        io.emit("updatePot&Stack", gameController.getPlayers(), gameController.getPot(),winnerName,nbJetonsGagnes)
                    
                    
                    
                    }else if (winner == null) {
                        passageALaProchaineStreet(io,gameController)
                    }
             
                }
                    }
            else if (players_id != []) 
                //Si des joueurs n'ont pas fold au tour d'avant, on recommence au début du tableau pr les faire rejoeur
                //si il y a eu une mise
                {
                // Si il ne reste que un joueur ça veut dire que c'est le seul à ne pas avoir fold donc il  et passage prochaine street
                if (players_id.length == 1) {
                    const player_winner = players.find(player => player.id === players_id[0]);
                    // Trouver le joueur perdant qui n'est pas le gagnant
                    const player_loser = players.find(player => player.id !== player_winner.id);
                    loserName = player_loser.name
                    console.log("Voici players_id pour ce toure : ", players_id)
                    console.log(player_winner.name, " a gagnée le coup")
                    potCourant = 0                    
                    console.log("WINNER")
       

                    //On fait gagner le coup au joueur restant en lui donnant le pot
                    nbJetonsGagnes = gameController.winChips(player_winner)
                    io.emit("updatePot&StackWin", gameController.getPlayers(), gameController.getPot(),player_winner.name,nbJetonsGagnes,'', '')
                    gameController.resetGame()
                    idQuiOntFold = [] ;
                    streetCourante = 0 ;
                    potCourant = 0;
                    winner = null;
                 }
                 //Sinon si il ne reste rien à call alors on passe au prochain tour
                else if (potCourant == 0) {
                    //Si on est deja à la rivero n determine le gagnant
                    if(streetCourante == 3) {
                        player1 = gameController.getPlayers()[0]
                        player2 = gameController.getPlayers()[1]
                        console.log("Player 1 name", player1.getName,"Player 1 namee", player2.getName)
                        result = gameController.getGame().getWinner(player1,player2,sharedCards)
                        console.log(result.player1.name," a : ",result.player1.combination, result.player2.name," a : ", result.player2.combination, result.winner, " a donc remporté le coup avec : " , result.winningCombination )
                    
                        //On fait gagner le coup au joueur restant en lui donnant le pot
                        if (result.winner == "Player 1") {
                            mainGagnante = result.player1.combination
                            mainPerdante = result.player2.combination
                            winnerName = result.player1.name
                        }else if (result.winner == "Player 2") {
                            mainGagnante = result.player2.combination
                            winnerName = result.player2.name
                            mainPerdante = result.player1.combination
                        }else {
                            console.log("Egalité, partage du pot")
                            mainGagnante = "Aucune"
                            winnerName = "Egalité"
                        }
                        //On va chercher l'attribut du player gagnant en fonction du pseudo retourné
                        gameController.getPlayers().forEach(player => {
                            if (player.getName === winnerName) {
                                playerWinner = player;  // On assigne le joueur correspondant à playerWinner
                            }
                        });

                        nbJetonsGagnes = gameController.winChips(playerWinner)
                        io.emit("updatePot&StackWin", gameController.getPlayers(), gameController.getPot(),winnerName,nbJetonsGagnes,result.winningCombination, mainPerdante)
                        gameController.resetGame()
                        idQuiOntFold = [] ;
                        streetCourante = 0 ;
                        potCourant = 0;
                        winner = null;
                    
                    }else if (winner == null) {
                        passageALaProchaineStreet(io,gameController)
                    }
                    

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
