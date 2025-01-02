const Deck = require('./Deck');
const Card = require('./Card');
const Player = require("./Player");

class PokerGame {
    constructor(players) {
        this.deck = new Deck();
        this.deck.shuffle();  // Mélange le deck au début du jeu
        this.communityCards = [];  // Cartes communes au centre de la table
        this.pot = 0;  // Pot central pour les mises
        this.currentPlayerIndex = 0;  // Index du joueur actuel
        this.dealerIndex = 0;  // Index du donneur
        this.players = players;  // Liste des joueurs
    }

    getGame() {
        return this
    }

    getPot() {
        return this.pot
    }
    //Fonction qui s'occupe de changer les position des joueurs en décalant vers la gauche (le LJ devient BTN etc ...)
    changeBlind(players) {
        players.forEach((player) => {
            var nbPlayers = players.length
            console.log('p_reelle',player.p_reelle, 'nbPlayers : ', nbPlayers)
            // Si la position du joueur +1 est égal au nb de joueurs alors on revient à 0 (ce joueur devient le BTN donc)
            switch (player.p_reelle +1)
            {
                case (nbPlayers) :
                    player.p_reelle = 0
                    break;
                default :
                    player.p_reelle ++
            }

        })
    }

    // Getter pour récupérer la liste des joueurs
    getPlayers() {
        return this.players;
    }

    // Setter pour mettre à jour la liste des joueurs
    setPlayers(newPlayers) {
        this.players = newPlayers;
    }

    // Distribuer deux cartes à chaque joueur
    dealCards() {
        this.deck.resetListCard(); // On remet toutes les cartes dans le paquet
        this.deck.shuffle();  // Mélange le deck au début de chaque tour
        for (let i = 0; i < 2; i++) {
            this.players.forEach(player => {
                player.receiveCard(this.deck.deal());
            });
        }
    }

    // Tour de mise d'un joueur
    bet(player, amount) {
        player.bet(amount);
        this.pot += amount;
        console.log(player.name, 'perd : ' , amount , ' jetons')
    }

    getNbChips(player) {
        return player.getNbChips
    }
    resetPot() {
        this.pot = 0
    }
    //Donne le pot à un joueur et remet le pot à 0
    winPot(player) {
        player.winChips(this.pot)
        var potGagne = this.pot
        this.resetPot()
        return potGagne
    }


    // Tour de jeu : passe au joueur suivant
    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    // Révéler des cartes communes (flop, turn, river)
    revealCommunityCards(number) {
        for (let i = 0; i < number; i++) {
            this.communityCards.push(this.deck.deal());
        }
    }

    // Afficher les cartes communes sous forme de texte
    showCommunityCards() {
        return this.communityCards.map(card => card.toString()).join(', ');
    }

    // Déterminer le gagnant (simplifié)
    determineWinner() {
        // Logique simplifiée, retour du premier joueur par défaut pour l'instant
        return this.players[0];
    }
}

// Export de la classe PokerGame
module.exports = PokerGame;
