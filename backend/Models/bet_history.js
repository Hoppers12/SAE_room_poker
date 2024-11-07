const mongoose = require('mongoose');


const betSchema = new mongoose.Schema({
    id_bet:[{type : mongoose.Schema.Types.ObjectId, ref:'bet'}],
    date:{type:Date, default:Date.now},
    amount:{type:Number},
    description: { type: String},
});


const Bet = mongoose.model('bet_history', betSchema);
module.exports = Bet;
