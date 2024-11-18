const Card = require('./Card');


class Player {
    static nextId = 1; // Compteur statique pour générer des ID unique
    constructor(name, chips,p_x,p_y,p_partie) {
        this.id = Player.nextId++; // Assigner un ID unique à chaque nouveau joueur crée
        this.chips = chips; // Jetons du joueur
        this.hand = []; // Cartes du joueur
        this.currentBet = 0; // Mise courante du joueur
        this.folded = false;
        this.name = name;
        this.x = p_x ;
        this.y = p_y ;
        this.p_reelle = p_partie;

    }

    // (0 = BTN, 1 = SB, 2 = BB, 3 = HJ, 4 = LJ, 5 = CO)
    set setPositionReelle(position) {
        this.p_reelle = position;
    }

    get getPositionReelle() {
        return this.p_reelle;
    }
    set setX(value_x) {
        this.x = value_x ;
    }

    set setY(value_y) {
        this.y = value_y;
    }

    get getId() {
        return this.id ;
    }

    get getName() {
        return this.name;
    }



// Reçoit une carte après avoir supprimé les cartes du tour précédent
    receiveCard(card) {
        if (this.hand.length >= 2) {
            this.hand.pop()
            this.hand.pop()
        }
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

    putBlind(amount) {
        if (amount > this.chips) {
            //Faire tapis
        }
        this.chips -= amount ;
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