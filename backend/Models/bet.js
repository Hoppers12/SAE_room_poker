const mongoose = require('mongoose');


const betSchema = new mongoose.Schema({
    amount:{type:Number},
    bet_type: { type: String},
    bet_date:{type:Date},
    bet_odds:[{type: mongoose.Schema.Types.ObjectId, ref:'Odd'}],
    bet_id_team:{type:mongoose.Schema.Types.ObjectId, ref:'Team'},
    bet_result: { type: String},
    sport: [{type:mongoose.Schema.Types.ObjectId, ref: 'Sport'}],
});


const Bet = mongoose.model('Bet', betSchema);
module.exports = Bet;
