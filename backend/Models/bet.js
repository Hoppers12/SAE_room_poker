const mongoose = require('mongoose');
const {Mongoose} = require("mongoose");


const betSchema = new mongoose.Schema({
    amount:{type:Number},
    bet_type: { type: String},
    bet_date:{type:Date},
    bet_result: { type: String},
    sport: [{ type:mongoose.Schema.Types.ObjectId, ref: 'Sport'}],
});


const Bet = mongoose.model('Bet', betSchema);
module.exports = Bet;
