const mongoose = require('mongoose');


const betSchema = new mongoose.Schema({
    id_bet:{type:Number},
    date:{type:Date},
    amount:{type:Number},
    description: { type: String},
});


const Bet = mongoose.model('bet_history', betSchema);
module.exports = Bet;
