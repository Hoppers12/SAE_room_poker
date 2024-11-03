const PokerGame = require('../classesJeu/PokerGame');
let game = null; // Variable pour stocker la partie
let players = []; // Tableau contenant tous les joueurs présents


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
function getPot() {
    return game.pot
}
function getGame() {
    return game;
}

function ajoutNouveauJoueurDansPartie(newPlayer,io)
{
    players.push(newPlayer);
    game.setPlayers(players); // Mettre à jour la liste des joueurs
    var NbPlayer = getNbPlayers();
    // Envoi d'un message à tous les clients pour informer de l'arrivée d'un nouveau joueur
    io.emit("recevoirJoueur", newPlayer,players,game.pot);
}


function getPlayers() {
    return players;
}



function getNbPlayers() {
    return players.length;
}

function setPlayers(new_players) {
    players = new_players
}

module.exports = {
    gestionPartie,
    ajoutNouveauJoueurDansPartie,
    getPlayers,
    getNbPlayers,
    getGame,
    setPlayers,
    getPot,
};