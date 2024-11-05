const mongoose = require('mongoose');
const {Mongoose} = require("mongoose");


const oddSchema = new mongoose.Schema({
    match_id:[{type:mongoose.Schema.Types.ObjectId, ref:'Matches'}],
    odds_type: { type: Number},
    odds_value:{type:Number},
});


const Odd = mongoose.model('Odd', oddSchema);
module.exports = Odd;
