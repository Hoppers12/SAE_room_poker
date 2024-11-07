const mongoose = require('mongoose');


const betSchema = new mongoose.Schema({
    id_bet:[{type : mongoose.Schema.Types.ObjectId, ref:'bet'}],
});


const Bet = mongoose.model('bet_history', betSchema);
module.exports = Bet;
