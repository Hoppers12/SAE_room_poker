class PokerGame {
    constructor(players) {
        this.players = players; // Liste des joueurs
        this.deck = new Deck();
        this.deck.shuffle();
        this.communityCards = []; // Cartes communes au centre de la table
        this.pot = 0; // Pot central
        this.currentPlayerIndex = 0; // Index du joueur en cours
        this.dealerIndex = 0; // Index du dealer
    }

    // Distribuer deux cartes à chaque joueur
    dealCards() {
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
    }

    // Tour de jeu: passe au joueur suivant
    nextTurn() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    // Affiche les cartes communes (flop, turn, river)
    revealCommunityCards(number) {
        for (let i = 0; i < number; i++) {
            this.communityCards.push(this.deck.deal());
        }
    }

    // Montre les cartes de la communauté sous forme de texte
    showCommunityCards() {
        return this.communityCards.map(card => card.toString()).join(', ');
    }

    // Déterminer le gagnant (simplifié, sans gestion des mains complexes)
    determineWinner() {
        // À implémenter : la logique pour déterminer la meilleure main
        return this.players[0]; // Exemple : retour du premier joueur comme gagnant par défaut
    }
}
