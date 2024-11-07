const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  firstname: { type: String},
  name: { type: String},
  birthdate:{type:Date},
  city: { type: String},
  address: { type: String},
  postCode: { type: String},
  nationality: { type: String},
  phone: { type: String},
  pseudo: { type: String, unique: true },
  email: { type: String,unique: true },
  password: { type: String},
  money:{ type: Number, default:10000},
  isAdmin: { type: Boolean, default: false },
  bets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet' ,default : []} ],
  bet_history : [{type: mongoose.Schema.Types.ObjectId, ref: 'bet_history' ,default :[]}]
});


const User = mongoose.model('User', userSchema);
module.exports = User;
