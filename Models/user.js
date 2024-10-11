const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
  firstname:{type:String},
  name: { type: String},
  birthdate:{type:Date},
  city: { type: String},
  address: { type: String},
  postCode: { type: String},
  nationality: { type: String},
  phone: { type: String},
  pseudo: { type: String},
  email: { type: String,unique: true },
  password: { type: String},
  isAdmin: { type: Boolean, default: false },
});


const User = mongoose.model('User', userSchema);
module.exports = User;
