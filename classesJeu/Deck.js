const Card = require('./Card')
class Deck {
    constructor() {
        this.cards = [];
        const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
        const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
        suits.forEach(suit => {
            ranks.forEach(rank => {
                this.cards.push(new Card(rank, suit));
            });
        });
    }

    // Mélange le paquet de cartes
    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }


    // Distribue une carte
    deal() {
        return this.cards.pop();
    }
}
module.exports = Deck;