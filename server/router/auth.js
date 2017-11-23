const router = require('express').Router();
const User = require('../models/User');
const validator = require('validator');
const jwt = require('jwt-simple');
const config = require('../config');
const passport = require('passport');
const axios = require('axios');

const authSignin = passport.authenticate('local', {session: false});

const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com/me?fields=name,id,email';

const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}

router.post('/signin', authSignin, (req, res) => {

    res.json({token: tokenForUser(req.user)});

})

router.post('/signup', (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;


    if(!email || !password || !validator.isEmail(email)) {
        return res.status(422).send({error: 'You must provide a valid email and password!'});
    }
    User.findOne({email: email})
    .then(existingUser => {
        if(existingUser) {
            return res.status(422).send({error: 'Email already in use'});
        }

        const user = new User({email, password});
        user.save((err) => {
            if(err) return next(err);

            res.json({success: true, token: tokenForUser(user)});
        })
    })
    .catch(err => next(err));

})

router.post('/facebook', (req, res) => {
    const { accessToken } = req.body;
    axios.get(`${FACEBOOK_GRAPH_URL}&access_token=${accessToken}`)
    .then( userInfo => {
        console.log(userInfo)
        const userData = userInfo.data;
        User.findOne({ facebook_id: userData.id  })
        .then(user => {
            if(user) {
                console.log('login')
                return res.json({token: tokenForUser(user)});
            }

            user = new User();
            user.name = userData.name;
            user.facebook_id = userData.id;
            user.image = `http://graph.facebook.com/${userData.id}/picture?type=square`;
            if(userData.email) {
                user.email = userData.email;
            }
            user.save((err, newUser) => {
                return res.json({token: tokenForUser(newUser)});
            })
        })
        .catch(err => {
            res.status(422).send('Something went wrong! Please try again later')
        })
    })
    .catch(err => {
        console.log(err)
         return res.status(422).send('Something went wrong, please try again later!');
    })
    
    // res.status(422).send('Something went wrong')
});


module.exports = router;