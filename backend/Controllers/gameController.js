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
function getNbChips(player) {
    return player.getNbChips()
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
    printSharedCards
};


