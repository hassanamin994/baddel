var  FacebookStrategy = require('passport-facebook').Strategy;
var User = require('../../models/User');

module.exports = function(passport) {

  passport.use(new FacebookStrategy({
    clientID: '310365132768828',
    clientSecret: 'b1ad7f6e532e36beca31c897081eeefc',
    callbackURL: 'http://localhost:3000/auth/facebook/callback',
    profileFields: ['email','id', 'first_name', 'gender', 'last_name', 'picture']
  }, function(accessToken, refreshToken, profile, done){
    console.log(accessToken, refreshToken, profile);
    done(null, profile);
  }));


}