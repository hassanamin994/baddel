var mongoose = require('mongoose');
var Schema = mongoose.Schema; 

var userSchema = new Schema({

  username: {type: String},
  profile: {facebook: {type: String}, twitter: {type: String}},
  phone_number: String,

})

module.exports = mongoose.model('User', userSchema);