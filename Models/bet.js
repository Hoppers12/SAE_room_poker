const mongoose = require('mongoose');


const betSchema = new mongoose.Schema({
    amount:{type:Number},
    bet_type: { type: String},
    bet_date:{type:Date},
    bet_result: { type: String},
    sport: { type: String},
});


const Bet = mongoose.model('Bet', betSchema);
module.exports = Bet;
