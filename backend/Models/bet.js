const mongoose = require('mongoose');


const betSchema = new mongoose.Schema({
    amount:{type:Number,default:0},
    bet_date:{type:Date},
    bet_expire_date:{type:Date, default:Date.now + 7},
    bet_odds:[{type: mongoose.Schema.Types.ObjectId, ref:'Odd'}],
    bet_id_team:{type:String},
    bet_id_player:{type:mongoose.Schema.Types.ObjectId, ref:'Player'},
    bet_result: { type: String},
    sport: [{type:mongoose.Schema.Types.ObjectId, ref: 'Sport'}],
});


const Bet = mongoose.model('Bet', betSchema);
module.exports = Bet;
