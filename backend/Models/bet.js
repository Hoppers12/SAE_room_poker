const mongoose = require('mongoose');


const betSchema = new mongoose.Schema({
    bet_date:{type:Date},
    bet_expire_date: { type: Date, default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) },
    bet_odds:[{type: mongoose.Schema.Types.ObjectId, ref:'Odd'}],
    team:{type:mongoose.Schema.Types.ObjectId, ref: 'Team'},
    bet_result: { type: String},
    sport: [{type:mongoose.Schema.Types.ObjectId, ref: 'Sport'}],
    matches: [{type:mongoose.Schema.Types.ObjectId, ref: 'Match'}],
});


const Bet = mongoose.model('Bet', betSchema);
module.exports = Bet;
