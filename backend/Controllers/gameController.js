const PokerGame = require('../classesJeu/PokerGame');
let game = null; // Variable pour stocker la partie
let players = []; // Tableau contenant tous les joueurs présents


//Fonction qui crée la partie ou appelle la fonction qui ajoute le joueur a une partie deja existante
function gestionPartie(newPlayer,io)
{

        ajoutNouveauJoueurDansPartie(newPlayer,io)

    
}
function getPot() {
    return game.pot
}
function getGame() {
    return game;
}
function getNbChips(player) {
    return player.getNbChips()
}
function resetGame() {
    players = []
    game.resetGame()
}

function ajoutNouveauJoueurDansPartie(newPlayer,currentGame,io)
{
    console.log("currentGameplayers : " , currentGame.getPlayers())
    currentGame.players.push(newPlayer);
    console.log("currentGameplayers : " , currentGame.getPlayers())
    // Envoi d'un message à tous les clients pour informer de l'arrivée d'un nouveau joueur
    io.emit("recevoirJoueur", newPlayer,currentGame.players,currentGame.pot);
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

//Fais gagner un pot à un joueur donné
function winChips(player) {
    nbJetonsGagnes = game.winPot(player)
    return nbJetonsGagnes
}

//Ajoute le nombre de cartes communes correspondantes à chaque street dans le tab game.communityCards
function printSharedCards(streetCourante) {
    if (streetCourante == 1) {
        game.revealCommunityCards(3)
    }else if (streetCourante == 2) {
        game.revealCommunityCards(1)
    }else if (streetCourante == 3) {
        game.revealCommunityCards(1)
    }

    return game.getCommunityCards()
}

module.exports = {
    gestionPartie,
    ajoutNouveauJoueurDansPartie,
    getPlayers,
    getNbPlayers,
    getGame,
    setPlayers,
    getPot,
    winChips,
    getNbChips,
    printSharedCards,
    resetGame
};


