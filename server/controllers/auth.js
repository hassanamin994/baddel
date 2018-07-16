const passport = require('passport');
const axios = require('axios');
const validator = require('validator');
const jwt = require('jwt-simple');

const config = require('../config');
const responseUtils = require('../utils/responseUtils');
const userModel = require('../models/User');


const FACEBOOK_GRAPH_URL = 'https://graph.facebook.com/me?fields=name,id,email';


const auth = {

    login: function (req, res) {
        let data = { token: tokenForUser(req.user), user: req.user }
        return responseUtils.jsonSuccess(res, data);
    },

    signup: function (req, res, next) {
        const email = req.body.email;
        const password = req.body.password;


        if (!email || !password || !validator.isEmail(email)) {
            return responseUtils.jsonValidate(res, 'You must provide a valid email and password!')
        }

        userModel.findOne({ email: email })
            .then(existingUser => {
                if (existingUser) {
                    return responseUtils.jsonValidate(res, 'Email already in use');
                }

                const user = new User({ email, password });
                user.save((err) => {
                    if (err) {
                        console.log(err);
                        return responseUtils.jsonError(res, 'An error has occured while signing you up, please try again');
                    }

                    return responseUtils.jsonSuccess(res, { token: tokenForUser(user), user: user })
                })
            })
            .catch(err => {
                return responseUtils.jsonError('Error while signing up, please try again');
            });
    },

    loginFacebook: function (req, res, next) {

        const { accessToken } = req.body;
        axios.get(`${FACEBOOK_GRAPH_URL}&access_token=${accessToken}`)
            .then(userInfo => {
                console.log(userInfo)
                const userData = userInfo.data;

                userModel.findOne({ facebook_id: userData.id })
                    .then(user => {
                        if (user) {
                            return responseUtils.jsonSuccess(res, { token: tokenForUser(user), user: user });
                        }

                        user = new User();
                        user.name = userData.name;
                        user.facebook_id = userData.id;
                        user.image = `http://graph.facebook.com/${userData.id}/picture?type=square`;
                        if (userData.email) {
                            user.email = userData.email;
                        }
                        user.save((err, newUser) => {
                            return responseUtils.jsonSuccess(res, { token: tokenForUser(newUser), user: newUser })
                        })
                    })
                    .catch(err => {
                        return responseUtils.jsonError(res, 'Something went wrong, please try again later!');
                    })
            })
            .catch(err => {
                console.log(err)
                return responseUtils.jsonError(res, 'Something went wrong, please try again later!');
            })

    }


}



const tokenForUser = (user) => {
    const timestamp = new Date().getTime();
    return jwt.encode({ sub: user.id, iat: timestamp }, config.secret);
}


module.exports = exports = auth;