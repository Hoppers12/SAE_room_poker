const mongoose = require('mongoose');

const betUserSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bets: [
        {
            matchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true },
            homeTeam: { type: String, required: true },
            awayTeam: { type: String, required: true },
            selectedType: { type: String, required: true },
            selectedOdd: { type: Number, required: true },
        },
    ],
    stake: { type: Number, required: true },
    totalOdds: { type: Number, required: true },
    potentialGain: { type: Number, required: true },
    placedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['Pending', 'Won', 'Lost'], default: 'Pending' },
});

const BetUser = mongoose.model('BetUser', betUserSchema);
module.exports = BetUser;
