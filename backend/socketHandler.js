const Player = require('./classesJeu/Player');
const PokerGame = require('./classesJeu/PokerGame'); // Vérifie cet import
const gameController = require('./Controllers/gameController');
const blinds = require('./utils/blind');
const playerController = require('./Controllers/playerController');


let playerSockets = {}; // Associer chaque socket.id au joueur





function socketHandler(io) {
    io.on('connection', (socket) => {
        console.log('A user connected', socket.id);

        socket.on('joinGame', (pseudo) => {
            // On crée un nouveau joueur après que le client ait rentré son pseudo
                    try
                    {
                        // On vérifie si le pseudo du joueur n'est pas déjà autour de la table
                        gameController.getPlayers().forEach((player) => {
                            console.log("joueur : " ,player.getName)
                            if (player.getName === pseudo) {
                                throw new Error('Le joueur a déjà rejoint la partie.');
                            }
                        })

                        // On va chercher les coordonnées de là où sera placé le joueur en fonction du nb joueurs restant
                        const [x,y] = playerController.findCoord(gameController.getPlayers());
                        console.log("x et y : ",x,y)

                        console.log('coord actuelle : ', gameController.getPlayers().length)
                        // Retourne la position réelle que va occuper le joueur rentrant lors de son 1er tour de table
                        // (0 = BTN, 1 = SB, 2 = BB, 3 = HJ, 4 = LJ, 5 = CO)
                        const p_reelle = playerController.findPositionReelle(gameController.getPlayers().length)

                        const newPlayer = new Player(pseudo, 1000,x,y,p_reelle);

                        // Associer le socket.id au joueur nouvellement créé
                        playerSockets[socket.id] = newPlayer;
                        console.log(gameController.getPlayers().length);

                        gameController.gestionPartie(newPlayer,io) ;


                    // Affichage d'un message qui dit que l'on a déjà rejoint la partie
                    } catch (error)
                    {
                        console.error('la' ,error.message); // Affiche le message d'erreur
                    }




            // Gestion de la déconnexion des joueurs
            socket.on('disconnect', () => {
                console.log('A user disconnected', socket.id);

                // Récupérer le joueur associé à ce socket.id
                const disconnectedPlayer = playerSockets[socket.id];

                // Supprimer le joueur déconnecté du tableau des joueurs
                gameController.setPlayers(gameController.getPlayers().filter(player => player !== disconnectedPlayer)) ;
                // Enlever le joueur de la correspondance socket-joueur
                delete playerSockets[socket.id];

                console.log("players : ",gameController.getPlayers())

                //A chaque fois qu'un joueur se deconnecte, on rééorganise la table en fonction du nb de joueurs restant
                gameController.getPlayers().forEach((player,index) =>
                {
                    const [x,y]= playerController.findCoord2(index)
                    //On donne des nouvelles coordonnées au joueur
                    player.setX = x;
                    player.setY = y ;
                    player.setPositionReelle = playerController.findPositionReelle(index)
                });

                // Informer les autres joueurs qu'un joueur a quitté la partie
                io.emit("quitterJoueur", disconnectedPlayer,gameController.getPlayers(),gameController.getPot);
                console.log(gameController.getPlayers());
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

        //Reception du socket émit par le front lors du click sur le bouton
        socket.on('beginGame', () =>
        {
            console.log("La partie va commencer")

            const amount_SB = 0.5
            const amount_BB = 1

            // SB et BB posent leurs blindes
            blinds.putBlinds(amount_SB,amount_BB,gameController.getPlayers(),gameController.getGame());
            console.log('Le pot est de : ' ,gameController.getPot())

            //J'envoie au front la liste des joueurs et le nouveau pot
            io.emit("updatePot&Stack",gameController.getPlayers(),gameController.getPot())
        });

        //Fais changer les places reelles pr passer au tour suivant (btn devient SB etc)
        socket.on('nextTour', () => {

            gameController.getGame().changeBlind(gameController.getPlayers())

            io.emit('updatePositionReelle',gameController.getPlayers(),gameController.getPot())
            const amount_SB = 0.5
            const amount_BB = 1

            // SB et BB posent leurs blindes
            blinds.putBlinds(amount_SB,amount_BB,gameController.getPlayers(),gameController.getGame());
            console.log('Le pot est de : ' ,gameController.getPot())

            //J'envoie au front la liste des joueurs et le nouveau pot
            io.emit("updatePot&Stack",gameController.getPlayers(),gameController.getPot())
        })
    });

}





module.exports = {
    socketHandler
};
