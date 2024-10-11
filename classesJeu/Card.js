class Card {
    constructor(rank, suit) {
        this.rank = rank; // '2', '3', '4', ..., 'J', 'Q', 'K', 'A'
        this.suit = suit; // 'hearts', 'diamonds', 'clubs', 'spades'
    }

    // Renvoie la représentation textuelle de la carte, ex: "A♠"
    toString() {
        const suitsSymbols = {
            hearts: '♥',
            diamonds: '♦',
            clubs: '♣',
            spades: '♠'
        };
        return `${this.rank}${suitsSymbols[this.suit]}`;
    }
}
module.exports = Card;