const passport = require('passport');
const User = require('../models/User');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local').Strategy;


// Local Strategy Login
const localOptions = {
    usernameField: 'email',
};

const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
    User.findOne({email: email}, (err, user) => {
        if(err) return done(err);
        if(!user) return done(null, false);

        // compare passwords!
        user.comparePassword(password, (err, isMatch) => {
            if(err) return done(err);
            if(!isMatch) return done(null, false);
            else return done(null, user);
        });

    });
});


// JWT Strategy 

// Setup Strategy options 
const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromHeader('authorization'),
    secretOrKey: config.secret
};

var jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub, (err, user) => {
        if(err) return done(err, false);

        if(user) 
            return done(null, user);
        else
            return done(null, false);
    });
});

passport.use(jwtLogin);
passport.use(localLogin);