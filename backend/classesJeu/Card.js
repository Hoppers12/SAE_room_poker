class Card {
    constructor(rank, suit) {
        this.rank = rank; // '2', '3', '4', ..., 'J', 'Q', 'K', 'A'
        this.suit = suit; // 'coeur', 'carreau', 'pique', 'trèfle'
    }

    // Renvoie la représentation textuelle de la carte, ex: "A♠"
    toString() {
        const suitsSymbols = {
            coeur: '♥',
            carreau: '♦',
            trefle: '♣',
            pique: '♠'
        };
        return `${this.rank}${suitsSymbols[this.suit]}`;
    }
}
module.exports = Card;