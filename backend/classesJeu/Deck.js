const Card = require('./Card')
class Deck {
    suits = ['coeur', 'carreau', 'trèfle', 'pique'];
    ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    constructor() {
        this.cards = [];

        this.resetListCard()
    }

    //Fonction qui remet toutes les cartes dans le paquet
    resetListCard() {
        this.cards=[]
        this.suits.forEach(suit => {
            this.ranks.forEach(rank => {
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