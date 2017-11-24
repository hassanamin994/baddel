var mongoose = require('mongoose');
var Schema = mongoose.Schema; 
const bcrypt = require('bcrypt-nodejs');


var userSchema = new Schema({
  email: {
    type: String,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false
  },
  name: String,
  facebook_id: String,
  image: String,
  phone: String

})

// On save Hook, encrypt password
userSchema.pre('save', function (next) {
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

userSchema.methods.comparePassword = function (candidatePassword, callback) {
  bcrypt.compare(candidatePassword, this.password, (err, isMatch) => {
    if(err) return callback(err);
    return callback(null, isMatch);
  });
}

module.exports = mongoose.model('User', userSchema);