class HandEvaluator {
    static handRanks = {
        "highCard": 1,
        "pair": 2,
        "twoPair": 3,
        "threeOfAKind": 4,
        "straight": 5,
        "flush": 6,
        "fullHouse": 7,
        "fourOfAKind": 8,
        "straightFlush": 9,
        "royalFlush": 10
    };

    static handRankNames = {
        1: "High Card",
        2: "Pair",
        3: "Two Pair",
        4: "Three of a Kind",
        5: "Straight",
        6: "Flush",
        7: "Full House",
        8: "Four of a Kind",
        9: "Straight Flush",
        10: "Royal Flush"
    };

    // Évaluer une main complète (2 cartes + 5 cartes communes)
    static evaluate(cards) {
        const sortedCards = this.sortByRank(cards);
        
        if (this.isRoyalFlush(sortedCards)) return { rank: this.handRanks.royalFlush, name: "Royal Flush", kickers: [] };
        if (this.isStraightFlush(sortedCards)) return { rank: this.handRanks.straightFlush, name: "Straight Flush", kickers: [sortedCards[0]] };
        if (this.isFourOfAKind(sortedCards)) return { rank: this.handRanks.fourOfAKind, name: "Four of a Kind", kickers: this.getKickers(sortedCards, 4) };
        if (this.isFullHouse(sortedCards)) return { rank: this.handRanks.fullHouse, name: "Full House", kickers: [] };
        if (this.isFlush(sortedCards)) return { rank: this.handRanks.flush, name: "Flush", kickers: this.getHighestCards(sortedCards, 5) };
        if (this.isStraight(sortedCards)) return { rank: this.handRanks.straight, name: "Straight", kickers: [sortedCards[0]] };
        if (this.isThreeOfAKind(sortedCards)) return { rank: this.handRanks.threeOfAKind, name: "Three of a Kind", kickers: this.getKickers(sortedCards, 3) };
        if (this.isTwoPair(sortedCards)) return { rank: this.handRanks.twoPair, name: "Two Pair", kickers: this.getKickersForTwoPair(sortedCards) };
        if (this.isPair(sortedCards)) return { rank: this.handRanks.pair, name: "Pair", kickers: this.getKickers(sortedCards, 2) };
        
        return { rank: this.handRanks.highCard, name: "High Card", kickers: this.getHighestCards(sortedCards, 5) };
    }

    // Trier les cartes par rang (ordre décroissant)
    static sortByRank(cards) {
        return cards.sort((a, b) => b.rank - a.rank);
    }

    // Comparer deux mains avec kickers et retourner le gagnant + détails
    static compareHands(hand1, hand2) {
        const comparisonResult = this.compareHandObjects(hand1, hand2);
        const winner = comparisonResult > 0 ? "Player 1" : (comparisonResult < 0 ? "Player 2" : "Tie");

        return {
            winner: winner,
            player1: {
                combination: hand1.name,
                kickers: hand1.kickers.map(card => card.toString())
            },
            player2: {
                combination: hand2.name,
                kickers: hand2.kickers.map(card => card.toString())
            },
            winningCombination: winner === "Tie" ? "Both equal" : (comparisonResult > 0 ? hand1.name : hand2.name)
        };
    }

    // Méthode pour comparer deux objets de mains
    static compareHandObjects(hand1, hand2) {
        if (hand1.rank > hand2.rank) return 1;
        if (hand1.rank < hand2.rank) return -1;

        // Si les combinaisons sont identiques, comparer les kickers
        for (let i = 0; i < hand1.kickers.length; i++) {
            if (hand1.kickers[i].rank > hand2.kickers[i].rank) return 1;
            if (hand1.kickers[i].rank < hand2.kickers[i].rank) return -1;
        }

        // Égalité parfaite
        return 0;
    }

    // Vérifier si les cartes forment une quinte flush royale
    static isRoyalFlush(cards) {
        return this.isStraightFlush(cards) && cards[0].rank === 14;
    }

    // Vérifier si les cartes forment une quinte flush
    static isStraightFlush(cards) {
        return this.isFlush(cards) && this.isStraight(cards);
    }

    // Vérifier si les cartes forment un carré (four of a kind)
    static isFourOfAKind(cards) {
        const counts = this.getRankCounts(cards);
        return Object.values(counts).includes(4);
    }

    // Vérifier si les cartes forment un full (brelan + paire)
    static isFullHouse(cards) {
        const counts = this.getRankCounts(cards);
        return Object.values(counts).includes(3) && Object.values(counts).includes(2);
    }

    // Vérifier si les cartes forment une couleur (flush)
    static isFlush(cards) {
        const suits = cards.map(card => card.suit);
        return suits.every(suit => suit === suits[0]);
    }

    // Vérifier si les cartes forment une suite (straight)
    static isStraight(cards) {
        const ranks = [...new Set(cards.map(card => card.rank))];
        if (ranks.length < 5) return false;
        for (let i = 0; i <= ranks.length - 5; i++) {
            if (ranks[i] - ranks[i + 4] === 4) return true;
        }
        return false;
    }

    // Vérifier si les cartes forment un brelan (three of a kind)
    static isThreeOfAKind(cards) {
        const counts = this.getRankCounts(cards);
        return Object.values(counts).includes(3);
    }

    // Vérifier si les cartes forment une double paire
    static isTwoPair(cards) {
        const counts = this.getRankCounts(cards);
        return Object.values(counts).filter(count => count === 2).length === 2;
    }

    // Vérifier si les cartes forment une paire
    static isPair(cards) {
        const counts = this.getRankCounts(cards);
        return Object.values(counts).includes(2);
    }

    // Obtenir les occurrences de chaque rang de carte
    static getRankCounts(cards) {
        const counts = {};
        cards.forEach(card => {
            counts[card.rank] = (counts[card.rank] || 0) + 1;
        });
        return counts;
    }

    // Obtenir les kickers (cartes restantes après une combinaison principale)
    static getKickers(cards, count) {
        const rankCounts = this.getRankCounts(cards);
        const mainRank = Object.keys(rankCounts).find(rank => rankCounts[rank] === count);
        const kickers = cards.filter(card => card.rank !== parseInt(mainRank));
        return this.getHighestCards(kickers, 5 - count);
    }

    // Obtenir les kickers pour une double paire
    static getKickersForTwoPair(cards) {
        const rankCounts = this.getRankCounts(cards);
        const pairs = Object.keys(rankCounts).filter(rank => rankCounts[rank] === 2).map(Number).sort((a, b) => b - a);
        const kicker = cards.find(card => card.rank !== pairs[0] && card.rank !== pairs[1]);
        return [...pairs, kicker];
    }

    // Obtenir les cartes les plus hautes
    static getHighestCards(cards, count) {
        return cards.slice(0, count);
    }
}

module.exports = HandEvaluator;
