const {Error} = require("mongoose");

class Player {
    constructor(name, chips) {
        this.chips = chips; // Jetons du joueur
        this.hand = []; // Cartes du joueur
        this.currentBet = 0; // Mise courante du joueur
        this.folded = false;
        this.name = name; // Statut du joueur (s'est couché ou non)
    }


    get getName() {
        return this.name;
    }



// Reçoit une carte
    receiveCard(card) {
        this.hand.push(card);
    }

    // Parier des jetons
    bet(amount) {
        if (amount > this.chips) {
            throw new Error('Pas assez de jetons');
        }
        this.chips -= amount;
        this.currentBet += amount;
    }

    // Se coucher (fold)
    fold() {
        this.folded = true;
    }

    // Récupérer sa main sous forme de texte
    showHand() {
        return this.hand.map(card => card.toString()).join(', ');
    }
}

// Export de la classe Player
module.exports = Player;