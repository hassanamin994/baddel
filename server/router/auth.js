const router = require('express').Router();
const User = require('../models/User');
const validator = require('validator');
const jwt = require('jwt-simple');
const config = require('../config');

const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
}

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


module.exports = router;