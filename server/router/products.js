const router = require('express').Router();
const Product = require('../models/Product');
const validator = require('validator');
const passport = require('passport');
const requireAuth = passport.authenticate('jwt', {session: false});

router.get('/', (req, res) => {
    const skip = req.query.skip || 0;
    const limit = req.query.limit || 10;
    Product.find()
    .skip(skip)
    .limit(limit)
    .then(products => {
        res.json(products);
    })
    .catch(err => {
        next(err);
    })
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

router.get('/:id', (req, res, next) => {
    const id = req.params.id;
    Product.findById(id)
    .populate('user')
    .then(product => {
        res.json(product);
    })
    .catch(err => {
        next({type: 'MONGOOSE', payload: err});
    })
});

router.patch('/:id', (req, res, next) => {
    // collect attributes to be updated
    const updateAttrs = {};
    const body = req.body;
    Object.keys(body).forEach(key => {
        updateAttrs[key] = body[key];
    });
    // prevent updating user field
    delete updateAttrs['user'];
    Product.findOneAndUpdate({_id: req.params.id}, updateAttrs, {new: true})
    .then(product => {
        return res.json(product);
    })
    .catch(err => {
        return next(err);
    })
});


module.exports = router;