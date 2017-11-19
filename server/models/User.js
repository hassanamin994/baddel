var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
const bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
    required: 'Please enter your email.'
  },
  password: {
    type: String,
    required: 'Enter a password'
  }

})

// On save Hook, encrypt password
userSchema.pre('save', (next) => {
  const user = this;
  bcrypt.genSalt(10, (err, salt) => {
    if(err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if(err) return next(err);
      user.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model('User', userSchema);