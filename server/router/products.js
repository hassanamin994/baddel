const router = require('express').Router();
const Product = require('../models/Product');
const validator = require('validator');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});

router.get('/', (req, res) => {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 10;
    res.json({skip, limit})
});

router.post('/', requireAuth, (req, res, next) => {
    const { title, location, price, trade_with } = req.body;
    console.log(req.user);
    const user = req.user;
    var product = new Product({
        title,
        location,
        price,
        trade_with,
        user: user.id
    });
    
    product.save((err, p) => {
        if(err) {
            return next({type: 'MONGOOSE', payload: err});
        }

        res.json(p);
    })
})


module.exports = router;